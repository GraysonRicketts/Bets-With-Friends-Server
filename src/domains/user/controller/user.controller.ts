import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUnique({ id });
  }
}


