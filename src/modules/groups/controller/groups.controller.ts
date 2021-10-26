import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { uuid } from '../../../types';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../entities/group.entity';
import { GroupsService } from './../service/groups.service';

const currentUser = '3d6678cb-d119-4657-9fb1-7fa0dc245d6e'

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {
  }
    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
      const {name} = createGroupDto;

      return this.groupsService.create(name, currentUser);
  }

  @Get()
  findAll(): Promise<Group[]> {
    return this.groupsService.findAllForUser(currentUser)
  }

  // @Get(':id')
  // findOne(@Param('id') id: uuid): Promise<Group> {
  //   return this.groupsService.findOne(id);
  // }
}
