import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from '../../domains/user/service/user.service';
import config from 'config';
import { isProd } from '../../config.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: !isProd(),
      secretOrKey: config.get('auth.jwt.secret'),
    });
  }

  async validate(payload) {
    const id = payload.sub;
    const user = await this.userService.findUnique({ id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
