import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from '../../../../logger/CustomLogger';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(CategoryService.name);
  }

  create(name: string, groupId: string) {
    return this.prisma.category.create({ data: { name, groupId } });
  }

  async findByName(name: string, groupId: string) {
    const categories = await this.prisma.category.findMany({
      where: { name, groupId },
    });

    if (categories.length > 1) {
      const err = new InternalServerErrorException();
      this.logger.error(
        'Should only be on category with name per group',
        err.stack,
        undefined,
        {
          name,
          groupId,
          categoryIds: categories.map((c) => c.id),
          categoryNames: categories.map((c) => c.name),
        },
      );
    }

    if (categories.length === 0) {
      return null;
    }

    return categories[0];
  }
}
