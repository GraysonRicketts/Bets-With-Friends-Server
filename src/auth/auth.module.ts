import { Module } from '@nestjs/common';
import { UserModule } from '../domains/user/user.module';
import { AuthService } from './service/auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRATION, JWT_SECRET, NODE_ENV } from '../env.constants';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports:[UserModule, PassportModule, JwtModule.registerAsync({
    useFactory: async () => {
      if (!JWT_EXPIRATION && NODE_ENV) {
        return { secret: JWT_SECRET }
      }
      
      return {
        secret: JWT_SECRET,
        signOptions: JWT_EXPIRATION && { expiresIn: JWT_EXPIRATION },}
      }
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
