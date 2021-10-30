import { Module } from '@nestjs/common';
import { AuditModule } from './audit/audit.module';
import { UsersModule } from '../domains/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupsModule } from '../domains/groups/groups.module'
import { LoggerModule } from '../logger/Logger.module';

@Module({
  imports: [
    LoggerModule,
    UsersModule,
    GroupsModule,
    AuditModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
