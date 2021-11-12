import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  BaseUserPayload,
  UserService,
  UserWithPasswordPayload,
} from '../../domains/user/service/user.service';
import { LoginDto } from './../dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { CIPHER_SECRET } from '../../env/env.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = (await this.userService.findUnique(
      { email },
      { withPassword: true },
    )) as UserWithPasswordPayload;
    if (!user.password) {
      throw new InternalServerErrorException('Should always have password');
    }

    const encyrptedPassword = this.encrypt(password);

    if (user && user.password === encyrptedPassword) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: BaseUserPayload) {
    const { id, displayName } = user;
    const payload = { displayName, sub: id };

    return {
      id,
      displayName,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async createAccount(displayName, email, rawPassword) {
    const password = this.encrypt(rawPassword);

    const user = await this.userService.findUnique({ email });
    if (!!user) {
      throw new BadRequestException('User aready exsits with that email');
    }

    const newUser = await this.userService.create({
      displayName,
      email,
      password,
    });
    
    return this.login(newUser);
  }

  private encrypt(password: string): string {
    if (!CIPHER_SECRET) {
      throw new InternalServerErrorException('Missing environment variable');
    }
    const secretKey = Buffer.from(CIPHER_SECRET, 'utf-8').slice(0, 32);

    const encryptedData = pbkdf2Sync(
      password,
      secretKey,
      1000,
      64,
      `sha512`,
    ).toString('utf-8');

    return encryptedData;
  }
}
