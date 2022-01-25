import { Global, Module } from '@nestjs/common';
import { CustomLogger } from './CustomLogger';

@Global()
@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
