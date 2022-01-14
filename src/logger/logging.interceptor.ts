import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CustomLogger } from './CustomLogger';
import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';
import { ALS } from '../main';

export const HEADER_TRACE = 'x-bfw-trace-id';

export interface TraceContext {
  traceId: string;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {
    this.logger.setContext('Interceptor');
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    // const response: Response = context.switchToHttp().getResponse();

    const traceId = randomUUID();
    // response.headers[HEADER_TRACE] = traceId;

    const traceContext = { traceId };
    ALS.enterWith(traceContext);

    const now = Date.now();
    return next.handle().pipe(
      tap(() =>
        this.logger.log('REQ end', undefined, {
          duration: Date.now() - now,
          path: request.url,
          method: request.method,
        }),
      ),
    );
  }
}
