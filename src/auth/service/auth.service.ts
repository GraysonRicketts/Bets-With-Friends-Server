import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  BaseUser,
  UserService,
  UserWithPassword,
} from '../../domains/user/service/user.service';
import { LoginDto } from './../dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = (await this.userService.findUnique(
      { email },
      { withPassword: true },
    )) as UserWithPassword;
    if (!user.password) {
        throw new InternalServerErrorException('Should always have password');
    }

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async getJwtToken(user: BaseUser) {
    const payload = { displayName: user.displayName, sub: user.id }

    return {
      accessToken: this.jwtService.sign(payload)
    }
  }

  async createAccount(displayName, email, rawPassword) {
    const password = rawPassword;
    return this.userService.create({ displayName, email, password})
  }
}
