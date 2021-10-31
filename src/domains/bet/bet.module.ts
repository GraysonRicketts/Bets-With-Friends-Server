import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { BetService } from './service//bet/bet.service';
import { BetController } from './controller/bet.controller';
import { CategoryService } from './service/category/category.service';

@Module({
  imports: [GroupModule],
  controllers: [BetController],
  providers: [BetService, CategoryService]
})
export class BetModule {}
