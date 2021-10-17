import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomDbLogger } from 'src/logger/CustomDbLogger';
import { CustomLogger } from 'src/logger/CustomLogger';
import { LoggerModule } from 'src/logger/Logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule,
    // See .env for TypeORM configurations
    TypeOrmModule.forRoot({
      retryAttempts: 0,
      useUTC: true,
      logger: new CustomDbLogger(new CustomLogger('TypeOrm'))
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
