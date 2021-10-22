import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { CustomLogger } from "../logger/CustomLogger";
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: CustomLogger) {
        this.logger.setContext('Interceptor')
    }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
      const response: Response = context.switchToHttp().getResponse();

      const traceId = randomUUID();
      response.headers['x-bfw-trace-id'] = traceId
    this.logger.log('REQ started', null, { traceId, path: request.url, method: request.method })

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => 
          this.logger.log('REQ end', null, { traceId, duration: Date.now() - now})),
      );
  }
}