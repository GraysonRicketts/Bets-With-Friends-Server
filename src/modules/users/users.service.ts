import { Injectable } from '@nestjs/common';
import { uuid } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  findOne(uuid: uuid) {
    throw new Error('Method not implemented.');
  }
  
  create(createBetDto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
}
