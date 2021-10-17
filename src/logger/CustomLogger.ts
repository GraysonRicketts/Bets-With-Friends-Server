import {
  Injectable,
  Scope,
  ConsoleLogger,
  LoggerService,
} from '@nestjs/common';
import { Colorizer } from 'logform';
import { Logger, QueryRunner } from 'typeorm';
import winston, { child, createLogger, format, transports } from 'winston';

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
};

type LogContext = { [key: string]: string };
const dateFormat = () => {
  return new Date(Date.now()).toUTCString();
};

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  private _logger: winston.Logger;
  private _service: string;

  constructor(context?: string) {
    super(context);

    this._service = context;
    this._logger = createLogger({
      levels,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
    });

    if (context) {
      this._logger.defaultMeta = { service: context };
    }

    if (process.env.NODE_ENV !== 'production') {
      const devFormat = format.printf((info) => {
        let message = `${info.level} | ${dateFormat()} | ${info.message}`;
        if (info.level === 'error' || info.level === 'fatal') {
          message += `\n\t${format.prettyPrint(info.stack)}` 
        }
        
        let colorizedMessage = format.colorize().colorize(
          info.level,
          message
        );
        return colorizedMessage;
      });
      this._logger.add(
        new transports.Console({
          format: devFormat,
        }),
      );
    } else {
      this._logger.add(new transports.Console());
    }
  }

  setContext(context: string) {
    this._service = context;
  }

  fatal(
    message: any,
    stack?: string,
    context?: string,
    children?: LogContext,
  ): void {
    const _context = context || this._service;
    this._logger
      .child({ stack, ...children, service: _context })
      .log('fatal', message);
  }

  error(
    message: any,
    stack?: string,
    context?: string,
    children?: LogContext,
  ): void {
    const _context = context || this._service;
    this._logger
      .child({ stack, ...children, service: _context })
      .error(message);
  }

  warn(message: any, context?: string, children?: LogContext): void {
    const _context = context || this._service;
    this._logger.child({ ...children, service: _context }).warn(message);
  }

  
  log(message: any, context?: string, children?: LogContext): void {
    const _context = context || this._service;
    this._logger.child({ ...children, service: _context }).info(message);
  }
}
