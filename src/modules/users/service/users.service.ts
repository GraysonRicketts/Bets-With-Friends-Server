import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uuid } from 'src/types';
import { CustomRepository } from '../../../CustomRepository';
import { CustomLogger } from '../../../logger/CustomLogger';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: CustomRepository<User>,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  findOne(uuid: uuid): Promise<User[]> {
    this.logger.log('here')
    return this.usersRepository.find({ id: uuid});
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const { name } = createUserDto;

    return this.usersRepository.save({ name });
  }
}
