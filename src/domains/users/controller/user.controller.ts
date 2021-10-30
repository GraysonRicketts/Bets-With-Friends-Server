import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomLogger } from 'src/logger/CustomLogger';
import { CreateLocalUserDto } from '../dto/create-user.dto';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService, private readonly logger: CustomLogger) {
  }

  @Post()
  create(@Body() createBetDto: CreateLocalUserDto) {
    return this.usersService.create(createBetDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUnique({ id });
  }
}


