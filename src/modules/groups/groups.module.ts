import { Module } from '@nestjs/common';
import { GroupsService } from './service/groups.service';
import { GroupsController } from './controller/groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { LoggerModule } from '../../logger/Logger.module';
import { GroupRepository } from './entities/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository]), LoggerModule],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
