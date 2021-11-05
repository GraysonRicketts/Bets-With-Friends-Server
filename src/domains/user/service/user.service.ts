import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLocalUserDto } from '../../../auth/dto/create-user.dto';

export const baseUser = Prisma.validator<Prisma.UserArgs>()({
  select: { id:true, email: true, displayName: true, score: true, version: true },
  
});
const passwordUser = Prisma.validator<Prisma.UserArgs>()({
  select: { ...baseUser.select, password: true },
});
const wagerUser = Prisma.validator<Prisma.UserArgs>()({
  select: { ...baseUser.select, wager: {
    select: {
      bet: {
        select: {
          id: true,
          closedAt: true
        }
      },
      amount: true,
      option: {
        select: {
          id: true,
          name: true
        }
      }
    }
  } },
});

export type BaseUserPayload = Prisma.UserGetPayload<typeof baseUser>;
export type UserWithPasswordPayload = Prisma.UserGetPayload<typeof passwordUser>;
export type UserWithWagerPayload = Prisma.UserGetPayload<typeof wagerUser>;

interface FindParams {
  email?: string;
  id?: string;
}
interface FindOpts {
  withPassword: boolean;
  withWager: boolean;
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
  ): Promise<BaseUserPayload | UserWithPasswordPayload | UserWithWagerPayload | null> {
    const { email, id } = params;
    if (!email && !id) {
      return Promise.resolve(null);
    }

    const where = email ? { email } : { id };

    if (opts?.withPassword) {
      return this.prisma.user.findUnique({
        ...passwordUser,
        where,
      });
    }

    if (opts?.withWager) {
      return this.prisma.user.findUnique({
        ...wagerUser,
        where,
      });
    }

    return this.prisma.user.findUnique({
      ...baseUser,
      where,
    });
  }

  create(createUserDto: CreateLocalUserDto): Promise<User> {
    const { displayName, email, password } = createUserDto;
    return this.prisma.user.create({ data: { displayName, email, password } });
  }
}
