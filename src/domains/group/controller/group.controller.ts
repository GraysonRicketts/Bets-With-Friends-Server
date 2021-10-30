import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { CreateGroupDto } from '../dto/create-group.dto';
import { GroupService } from '../service/group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    const { name } = createGroupDto;
    const currentUserId = req.user.id;

    return this.groupsService.create(name, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const currentUserId = req.user.id;
    return this.groupsService.findAllForUser(currentUserId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: uuid): Promise<Group> {
  //   return this.groupsService.findOne(id);
  // }
}
