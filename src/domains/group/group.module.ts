import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
