import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLocalUserDto } from '../../../auth/dto/create-user.dto';

export const baseUser = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    displayName: true,
    score: true,
    version: true,
  },
});
const passwordUser = Prisma.validator<Prisma.UserArgs>()({
  select: { ...baseUser.select, password: true },
});
const wagerUser = Prisma.validator<Prisma.UserArgs>()({
  select: {
    ...baseUser.select,
    wager: {
      select: {
        bet: {
          select: {
            id: true,
            closedAt: true,
          },
        },
        amount: true,
        option: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
});
const friendsUser = Prisma.validator<Prisma.UserArgs>()({
  select: {
    ...baseUser.select,
    friends: {
      select: {
        friend: {
          select: {
            id: true,
            email: true,
            score: true,
          },
        },
      },
    },
    sentFriendRequests: {
      select: {
        id: true,
        userTo: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    },
    receivedFriendRequests: {
      select: {
        id: true,
        userFrom: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    },
  },
});

export type BaseUserPayload = Prisma.UserGetPayload<typeof baseUser>;
export type UserWithPasswordPayload = Prisma.UserGetPayload<
  typeof passwordUser
>;
export type UserWithWagerPayload = Prisma.UserGetPayload<typeof wagerUser>;
export type UserWithFriendPayload = Prisma.UserGetPayload<typeof friendsUser>;

type FindParams = {
  email?: string;
  id?: string;
};
type FindOpts = {
  withPassword: boolean;
  withWager: boolean;
  withFriend: boolean;
};

type SimpleUser = { email: string; displayName: string };
type CreateUser = CreateLocalUserDto | SimpleUser;
function isLocal(
  user: CreateLocalUserDto | SimpleUser,
): user is CreateLocalUserDto {
  return (<CreateLocalUserDto>user).password !== undefined;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  async findUnique(
    params: FindParams,
    opts?: Partial<FindOpts> | undefined,
  ): Promise<
    | BaseUserPayload
    | UserWithPasswordPayload
    | UserWithWagerPayload
    | UserWithFriendPayload
    | null
  > {
    const { email, id } = params;
    if (!email && !id) {
      return Promise.resolve(null);
    }

    const where = email ? { email } : { id };

    if (!opts) {
      return this.prisma.user.findUnique({
        ...baseUser,
        where,
      });
    }

    const { withPassword: wp, withWager: ww, withFriend: wf } = opts;

    let select = {
      ...baseUser.select,
    };
    if (wp) {
      select = { ...select, ...passwordUser.select };
    }
    if (ww) {
      select = { ...select, ...wagerUser.select };
    }
    if (wf) {
      select = { ...select, ...friendsUser.select };
    }
    return this.prisma.user.findUnique({
      select,
      where,
    });
  }

  create(user: CreateUser): Promise<User> {
    const { displayName, email } = user;
    const password = isLocal(user) ? user.password : undefined;
    return this.prisma.user.create({ data: { displayName, email, password } });
  }
}
