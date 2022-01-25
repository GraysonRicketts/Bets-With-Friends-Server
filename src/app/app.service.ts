import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/logger/CustomLogger';

@Injectable()
export class AppService {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext(AppService.name);
  }

  healthcheck(): string {
    return 'Service is alive';
  }
}
