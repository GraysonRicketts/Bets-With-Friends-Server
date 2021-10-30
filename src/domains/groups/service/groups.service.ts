import { Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { group } from 'console';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(GroupsService.name);
  }

  async create(name: string, ownerId: string): Promise<Group> {
    return this.prisma.group.create({
      data: {
        name,
        ownerId,
        userGroup: {
          create: {
            userId: ownerId,
          },
        },
      },
      include: {
        userGroup: {
            include: {
                user: true
            }
        }
    }
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.user.findMany(
        {where: { id: userId},
        include: {
            userGroup: {
                include: {
                    group: true
                }
            }
        }}
    )
  }
}
