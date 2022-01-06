import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { CreateLocalUserDto } from '../dto/create-user.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { GoogleAuthGuard } from '../guard/google-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async loginGoogle() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async loginGoogleRedirect(@Request() req) {
    // return await this.authService.login(req.user);
    return true;
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('create')
  async create(@Body() data: CreateLocalUserDto) {
    const { displayName, email, password } = data;
    
    return await this.authService.createAccount(displayName, email, password);
  }
}