import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { uuid } from 'src/types';
import { CustomLogger } from '../../../logger/CustomLogger';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;
    return this.prisma.user.create({ data: { name } });
  }
}
