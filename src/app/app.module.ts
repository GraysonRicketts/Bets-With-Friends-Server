import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/Logger.module';
import { getConnectionOptions } from 'typeorm';
import { AuditModule } from './audit/audit.module';
import { UsersModule } from '../modules/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupsModule } from '../modules/groups/groups.module'

@Module({
  imports: [
    LoggerModule,
    // See .env for more TypeORM configurations
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          retryAttempts: 0,
          useUTC: true,
        } as Partial<TypeOrmModuleOptions>),
    }),
    UsersModule,
    GroupsModule,
    AuditModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
