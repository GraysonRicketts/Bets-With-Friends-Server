import { Module } from '@nestjs/common';
import { AuditModule } from './audit/audit.module';
import { UserModule } from '../domains/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from '../domains/group/group.module';
import { LoggerModule } from '../logger/Logger.module';
import { AuthModule } from '../auth/auth.module';
import { BetModule } from '../domains/bet/bet.module';

@Module({
  imports: [
    LoggerModule,
    UserModule,
    GroupModule,
    BetModule,
    AuditModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
