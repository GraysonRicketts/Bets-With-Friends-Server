import { Module } from '@nestjs/common';
import { UserModule } from '../domains/user/user.module';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import config from 'config';

const jwtSecret = config.get('auth.jwt.secret');
const jwtExpiration = config.get('auth.jwt.expiration');

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiration || '7d' },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
