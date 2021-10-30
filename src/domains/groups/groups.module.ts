import { Module } from '@nestjs/common';
import { GroupsService } from './service/groups.service';
import { GroupsController } from './controller/groups.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
