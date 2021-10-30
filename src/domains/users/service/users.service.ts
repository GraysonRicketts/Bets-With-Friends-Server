import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { uuid } from 'src/types';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateLocalUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findOne(uuid: uuid) {
    return this.prisma.user.findUnique({
      where: { id: uuid },
    });
  }

  async create(createUserDto: CreateLocalUserDto): Promise<User> {
    const { displayName, email, password } = createUserDto;
    return this.prisma.user.create({ data: { displayName, email, password } });
  }
}
