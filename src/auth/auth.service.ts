import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UserService,
  UserWithPassword,
} from '../domains/users/service/user.service';
import { LoginDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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
}
