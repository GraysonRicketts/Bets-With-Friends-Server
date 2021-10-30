import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomLogger } from 'src/logger/CustomLogger';
import { uuid } from 'src/types';
import { CreateLocalUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly logger: CustomLogger) {
  }

  @Post()
  create(@Body() createBetDto: CreateLocalUserDto) {
    return this.usersService.create(createBetDto);
  }

  @Get(':id')
  findOne(@Param('id') id: uuid) {
    return this.usersService.findOne(id);
  }
}


