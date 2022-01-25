import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { CreateLocalUserDto } from '../dto/create-user.dto';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async loginGoogle(@Request() req) {
    const { accessToken } = req.body;
    return await this.authService.loginWithGoogle(accessToken);
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
