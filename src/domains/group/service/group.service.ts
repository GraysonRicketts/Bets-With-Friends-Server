import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrivelegeLevel } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { baseBet } from '../../../prisma/bet.prisma';
import { baseUser } from '../../user/service/user.service';

const baseGroup = Prisma.validator<Prisma.GroupArgs>()({
  select: {
    id: true,
    name: true,
    userGroups: {
      select: {
        id: true,
        role: true,
        user: baseUser,
      },
    },
  },
});

const groupWithBets = Prisma.validator<Prisma.GroupArgs>()({
  select: {
    ...baseGroup.select,
    categories: {
      select: {
        name: true,
        id: true,
      },
    },
    bets: {
      ...baseBet,
      where: {
        deletedAt: null,
      },
    },
  },
});
type GroupWithBets = Prisma.GroupGetPayload<typeof groupWithBets>;

@Injectable()
export class GroupService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(GroupService.name);
  }

  async create(name: string, ownerId: string, members?: string[]) {
    // TODO: See if members exist

    const newUserGrps = members ? [ownerId, ...members] : [ownerId];

    return this.prisma.group.create({
      data: {
        name,
        userGroups: {
          create: newUserGrps.map((n) => ({
            userId: n,
            role: PrivelegeLevel.ADD_MEMBER,
          })),
        },
      },
      select: baseGroup.select,
    });
  }

  async addMembers(
    groupId: string,
    newMembers: string[],
    role = PrivelegeLevel.ADD_MEMBER,
  ) {
    // TODO: See if members exist
    const grp = await this.findOne(groupId);
    if (!grp) {
      throw new BadRequestException('Group does not exist');
    }

    const userIntersection = grp.userGroups.filter((ug) =>
      newMembers.find((nm) => nm === ug.user.id),
    );
    if (userIntersection.length) {
      throw new BadRequestException(
        'Users already part of group',
        userIntersection.map((ui) => ui.user.id).join(','),
      );
    }

    await this.prisma.userGroup.createMany({
      data: newMembers.map((nm) => ({ userId: nm, groupId, role })),
    });
    return this.findOne(groupId);
  }

  findAllForUser(userId: string) {
    return this.prisma.group.findMany({
      where: { userGroups: { some: { user: { is: { id: userId } } } } },
      select: baseGroup.select,
    });
  }

  findOne(id: string): Promise<GroupWithBets | null> {
    return this.prisma.group.findUnique({
      where: { id },
      select: groupWithBets.select,
    });
  }

  async isMemberOfGroup(userId: string, groupId: string) {
    const group = await this.findOne(groupId);

    // Make sure group exists
    if (!group) {
      this.logger.log('Group not found', undefined, { userId, groupId });
      return false;
    }

    // Make sure user is in the group
    const user = group.userGroups.find((ug) => ug.user.id === userId);

    if (!user) {
      this.logger.log('User not member of group', undefined, {
        userId,
        groupId,
      });
      return false;
    }

    return true;
  }
}
