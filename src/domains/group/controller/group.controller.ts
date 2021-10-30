import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateGroupDto } from '../dto/create-group.dto';
import { GroupService } from '../service/group.service';

const currentUser = '0218e59e-a697-4399-b500-69cccbe1e7d7'

@Controller('group')
export class GroupController {
  constructor(private readonly groupsService: GroupService) {
  }
    @Post()
    create(@Body() createGroupDto: CreateGroupDto) {
      const {name} = createGroupDto;

      return this.groupsService.create(name, currentUser);
  }

  @Get()
  findAll() {
    return this.groupsService.findAllForUser(currentUser)
  }

  // @Get(':id')
  // findOne(@Param('id') id: uuid): Promise<Group> {
  //   return this.groupsService.findOne(id);
  // }
}
