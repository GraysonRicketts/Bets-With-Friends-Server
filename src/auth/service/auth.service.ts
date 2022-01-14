import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  BaseUserPayload,
  UserService,
  UserWithPasswordPayload,
} from '../../domains/user/service/user.service';
import { LoginDto } from './../dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { pbkdf2Sync } from 'crypto';
import { CIPHER_SECRET, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } from '../../env/env.constants';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import { CustomLogger } from '../../logger/CustomLogger';

@Injectable()
export class AuthService {
  private googleAuth: OAuth2Client;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger
  ) {
    this.logger.setContext('AuthService')
    this.googleAuth = new google.auth.OAuth2(
      GOOGLE_OAUTH_CLIENT_ID,
      GOOGLE_OAUTH_CLIENT_SECRET
    );
  }

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
    const accessToken = this.createAccessToken(displayName, id)

    return {
      id,
      displayName,
      accessToken
    };
  }

  async loginWithGoogle(accessToken: string) {
    let email: string | undefined;
    try {
      const tokenInfo = await this.googleAuth.getTokenInfo(accessToken);
      email = tokenInfo.email;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
    if (!email) {
      throw new InternalServerErrorException();
    }

    // If user has never logged in before then create a user record for them
    let user = await this.userService.findUnique({email})
    if (!user) {
      user = await this.userService.create({ email, displayName: email })
    }

    return this.login(user);
  }

  private createAccessToken(displayName: string, id: string): string {
    const payload = { displayName, sub: id };
    return this.jwtService.sign(payload)
  }

  async createAccount(displayName: string, email: string, rawPassword?: string) {
    let password: string | undefined;
    if (rawPassword)
    password = this.encrypt(rawPassword);

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
