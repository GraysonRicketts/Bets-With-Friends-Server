import { Module } from '@nestjs/common';
import { UserModule } from '../domains/user/user.module';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';

@Module({
  controllers: [AuthController],
  imports:[UserModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
