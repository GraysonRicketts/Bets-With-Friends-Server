import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { BetService } from './service//bet/bet.service';
import { BetController } from './controller/bet.controller';
import { CategoryService } from './service/category/category.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [GroupModule, PrismaModule],
  controllers: [BetController],
  providers: [BetService, CategoryService]
})
export class BetModule {}
