import { Module } from '@nestjs/common';
import { UserModule } from '../domains/user/user.module';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../env.constants';

@Module({
  controllers: [AuthController],
  imports:[UserModule, PassportModule, JwtModule.register({
    secret: JWT_SECRET,
    signOptions: { expiresIn: '60s' },
  })],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
