import { Injectable, NestMiddleware } from '@nestjs/common';
import { CustomLogger } from '../../logger/CustomLogger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext('Middleware');
  }

  use(req: Request, res: Response, next: () => void) {
    this.logger.log(`GET ${req.}`)
    next();
  }
}
