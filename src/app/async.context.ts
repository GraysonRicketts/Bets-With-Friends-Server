import { AsyncLocalStorage } from 'async_hooks';

interface AsyncContext {
  traceId?: string;
  user?: {
    userId: string;
  };
}
export const ALS = new AsyncLocalStorage<AsyncContext>();
