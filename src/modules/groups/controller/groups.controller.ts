import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { uuid } from '../../../types';
import { CreateGroupDto } from '../dto/create-group.dto';
import { Group } from '../entities/group.entity';
import { GroupsService } from './../service/groups.service';

const currentUser = '349f8b57-5b83-459b-bbca-f269b50f4023'

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
