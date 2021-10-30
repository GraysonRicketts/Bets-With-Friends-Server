import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { CreateLocalUserDto } from '../dto/create-user.dto';
import { LocalAuthGuard } from '../local-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Post('create')
  async create(@Body() data: CreateLocalUserDto) {
    const { displayName, email, password } = data;
    
    return this.authService.createAccount(displayName, email, password);
  }
}