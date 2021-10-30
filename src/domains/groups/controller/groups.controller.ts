import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { uuid } from '../../../types';
import { CreateGroupDto } from '../dto/create-group.dto';
import { GroupsService } from '../service/groups.service';

const currentUser = '0218e59e-a697-4399-b500-69cccbe1e7d7'

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
  findAll(): Promise<any[]> {
    return this.groupsService.findAllForUser(currentUser)
  }

  // @Get(':id')
  // findOne(@Param('id') id: uuid): Promise<Group> {
  //   return this.groupsService.findOne(id);
  // }
}
