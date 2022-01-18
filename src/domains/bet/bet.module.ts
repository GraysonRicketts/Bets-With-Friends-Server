import { Module } from '@nestjs/common';
import { GroupModule } from '../group/group.module';
import { BetService } from './service//bet/bet.service';
import { BetController } from './controller/bet.controller';
import { CategoryService } from './service/category/category.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ScoreService } from './service/score/score.service';
import { UserModule } from '../user/user.module';
import { ScoreController } from './controller/score/score.controller';
import { OutcomeModule } from './service/bet/outcome/outcome.module';

@Module({
  imports: [GroupModule, PrismaModule, UserModule, OutcomeModule],
  controllers: [BetController, ScoreController],
  providers: [BetService, CategoryService, ScoreService],
})
export class BetModule {}
