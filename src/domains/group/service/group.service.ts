import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrivelegeLevel } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { baseUser } from '../../user/service/user.service';

const baseGroup = Prisma.validator<Prisma.GroupArgs>()({
  select: {
    id: true,
    name: true,
    userGroup: {
      select: {
        id: true,
        role: true,
        user: baseUser,
      },
    },
  },
});

@Injectable()
export class GroupService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(GroupService.name);
  }

  async create(name: string, ownerId: string) {
    return this.prisma.group.create({
      data: {
        name,
        userGroup: {
          create: {
            userId: ownerId,
            role: PrivelegeLevel.ADD_MEMBER,
          },
        },
      },
      select: baseGroup.select,
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.group.findMany({
      where: { userGroup: { every: { user: { is: { id: userId } } } } },
      select: baseGroup.select,
    });
  }
  
  findOne(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      select: baseGroup.select
    })
  }

  async addUserToGroup(userId: string, groupId: string, role = PrivelegeLevel.ADD_MEMBER) {
    await this.prisma.userGroup.create({data: { userId, groupId, role }})
    return this.findOne(groupId);
  }

  async verifyUserIsMemberOfGroup(userId: string, groupId: string) {
    const group = await this.findOne(groupId);
    
    // Make sure group exists
    if (!group) {
      this.logger.log('Group not found', undefined, { userId, groupId });
        return false
    }

    // Make sure user is in the group
    const user = group.userGroup.find(ug => ug.user.id === userId);

    if (!user) {
      this.logger.log('User not member of group', undefined, { userId, groupId });
      return false
    }

    return true;
  }
}
