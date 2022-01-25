import {
  Body,
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  ForbiddenException,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guard/jwt-auth.guard';
import { AddMemberDto } from '../dto/add-member.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { GroupService } from '../service/group.service';

@UseGuards(JwtAuthGuard)
@Controller('group')
export class GroupController {
  constructor(private readonly groupsService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    const { name, members } = createGroupDto;
    const currentUserId = req.user.id;

    return this.groupsService.create(name, currentUserId, members);
  }

  @Post('add-member')
  async addMember(@Body() addMemberDto: AddMemberDto, @Request() req) {
    const { groupId, members } = addMemberDto;
    const currentUserId = req.user.id;

    const isMember = await this.groupsService.isMemberOfGroup(
      currentUserId,
      groupId,
    );
    if (!isMember) {
      throw new ForbiddenException();
    }

    return await this.groupsService.addMembers(groupId, members);
  }

  @Get()
  findAll(@Request() req) {
    const currentUserId = req.user.id;
    return this.groupsService.findAllForUser(currentUserId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const group = await this.groupsService.findOne(id);

    if (!group) {
      return new NotFoundException();
    }

    return group;
  }
}
