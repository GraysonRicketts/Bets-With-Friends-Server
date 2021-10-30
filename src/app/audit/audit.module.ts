import { Module } from '@nestjs/common';
import { AuditSubscriber } from './audit.subscriber';

@Module({
  controllers: [],
  providers: [AuditSubscriber]
})
export class AuditModule {}
