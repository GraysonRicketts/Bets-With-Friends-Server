import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { ALS } from 'src/app/async.context';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(this.softDeleteMiddleware);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  private async softDeleteMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>,
  ) {
    /***********************************/
    /* SOFT DELETE */
    /***********************************/
    // Check incoming query type
    if (params.action === 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update';
      params.args['data'] = { deletedAt: DateTime.now() };
    }
    if (params.action == 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany';
      if (params.args.data != undefined) {
        params.args.data['deletedAt'] = DateTime.now();
      } else {
        params.args['data'] = { deletedAt: DateTime.now() };
      }
    }

    /***********************************/
    /* FIND AND AVOID DELETED */
    /***********************************/
    if (params.action == 'findUnique') {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = 'findFirst';
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where['deletedAt'] = null;
    }
    if (params.action == 'findMany') {
      // Find many queries
      if (params.args.where != undefined) {
        if (params.args.where.deletedAt == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where['deletedAt'] = null;
        }
      } else {
        params.args['where'] = { deletedAt: null };
      }
    }

    if (params.action == 'update') {
      // Change to updateMany - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = 'updateMany';
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where['deletedAt'] = null;
    }
    if (params.action == 'updateMany') {
      if (params.args.where != undefined) {
        params.args.where['deletedAt'] = null;
      } else {
        params.args['where'] = { deletedAt: null };
      }
    }

    return next(params);
  }

  private async auditMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<any>,
  ) {
    // Don't audit the audit
    if (params.model === 'Audit') {
      return next(params);
    }

    const result = await next(params);

    const context = ALS.getStore();
    const contextData = {
      traceId: context?.traceId,
      userId: context?.user?.userId,
    };

    let auditData = {
      data: {},
      action: params.action,
      targetId: '',
      ...contextData,
    };
    switch (params.action) {
      case 'executeRaw':
      case 'findFirst':
      case 'findMany':
      case 'findUnique':
      case 'queryRaw':
      case 'aggregate':
      case 'count':
        return result;
      case 'create':
        auditData.data = params.args.data;
        auditData.targetId = result.id;
        break;
      case 'createMany':
      case 'delete':
        auditData.targetId = params.args.where.id;
        break;
      case 'update':
      case 'updateMany':
      case 'upsert':
      case 'delete':
      case 'deleteMany':
    }

    await this.audit.create({ data: auditData });
  }
}
