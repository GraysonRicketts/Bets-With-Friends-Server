import { Injectable, NestMiddleware } from "@nestjs/common";
import crypto from 'crypto';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(_: Request, res: Response, next: () => void) {
    res.headers.set('x-bfw-trace-id', crypto.randomUUID())
    next();
  }
}
