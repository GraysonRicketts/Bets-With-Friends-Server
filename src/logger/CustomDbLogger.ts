import { Logger, QueryRunner } from 'typeorm';
import { CustomLogger } from './CustomLogger';
import DateTime from 'luxon';

export class CustomDbLogger implements Logger {
  constructor(private readonly logger: CustomLogger) {
  }

  private parametersToString(params: any[]): string {
      return params.join(', ')
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    this.logger.log(message, 'TypeOrmLog');
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.log(query, 'TypeOrmQuery', { parameters: this.parametersToString(parameters) });
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
      let errMsg;
      let stack;
      if (typeof(error) === 'string') {
        errMsg = error;
      } else {
          errMsg = error.message;
          stack = error.stack;
      }
      this.logger.error(errMsg, stack, 'TypeOrmError', { query: query, parameters: this.parametersToString(parameters)})
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    const dateString = DateTime.
    this.logger.warn('Slow query','TypeOrmError', { query: query, parameters: this.parametersToString(parameters)})
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {}

  logMigration(message: string, queryRunner?: QueryRunner): any {}
}
