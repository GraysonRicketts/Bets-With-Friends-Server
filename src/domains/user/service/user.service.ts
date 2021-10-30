import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLocalUserDto } from '../../../auth/dto/create-user.dto';

const baseUser = Prisma.validator<Prisma.UserArgs>()({
  select: { id:true, email: true, displayName: true },
});
const passwordUser = Prisma.validator<Prisma.UserArgs>()({
  select: { ...baseUser.select, password: true },
});

export type BaseUser = Prisma.UserGetPayload<typeof baseUser>;
export type UserWithPassword = Prisma.UserGetPayload<typeof passwordUser>;

interface FindParams {
  email?: string;
  id?: string;
}
interface FindOpts {
  withPassword?: true;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(UserService.name);
  }

  findUnique(
    params: FindParams,
    opts?: FindOpts | undefined,
  ): Promise<BaseUser | UserWithPassword | undefined> {
    const { email, id } = params;
    if (!email && !id) {
      return undefined;
    }

    const where = email ? { email } : { id };

    if (opts?.withPassword) {
      return this.prisma.user.findUnique({
        ...passwordUser,
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
