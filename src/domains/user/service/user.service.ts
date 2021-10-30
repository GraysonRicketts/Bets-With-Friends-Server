import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLocalUserDto } from '../../../auth/dto/create-user.dto';

const baseUser = Prisma.validator<Prisma.UserArgs>()({
  select: { email: true, displayName: true },
});
const passwordUser = Prisma.validator<Prisma.UserArgs>()({
  select: { email: true, displayName: true, password: true },
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
    opts?: FindOpts,
  ): Promise<BaseUser | UserWithPassword> {
    const { email, id } = params;
    const { withPassword } = opts;

    if (!email && !id) {
      return;
    }

    const where = email ? { email } : { id };

    if (withPassword) {
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
