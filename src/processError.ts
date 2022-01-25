import { CustomLogger } from './logger/CustomLogger';

export function handleProcessorErrors(logger: CustomLogger) {
  process.on('unhandledRejection', (err: Error) => {
    logger.fatal('Unhandled exception', err.stack, 'ProcessErrorHandler', {
      ...err,
    });
    logger.error('Unhandled exception', err.stack, 'ProcessErrorHandler', {
      ...err,
    });
  });

  process.on('uncaughtException', (err: Error) => {
    logger.fatal('Uncaught exception', err.stack, 'ProcessErrorHandler', {
      ...err,
    });
  });
}
