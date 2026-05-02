import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { sanitizeForLog } from './log-utils';

@Injectable()
export class AppLogger implements LoggerService {
  private static instance: AppLogger | undefined;
  private readonly logger: winston.Logger;

  constructor() {
    const isDev = process.env.NODE_ENV !== 'production';

    const transports: winston.transport[] = [];

    if (isDev) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length
                ? ' ' + JSON.stringify(sanitizeForLog(meta))
                : '';
              return `${timestamp} [${level}] ${message}${metaStr}`;
            }),
          ),
        }),
      );
    } else {
      transports.push(
        new (winston.transports as any).DailyRotateFile({
          filename: 'logs/app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          maxSize: '20m',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    }

    this.logger = winston.createLogger({ transports });
    AppLogger.instance = this;
  }

  static getInstance(): AppLogger | undefined {
    return AppLogger.instance;
  }

  log(message: string, meta?: Record<string, any>) {
    this.logger.info(message, meta ? { meta: sanitizeForLog(meta) } : {});
  }

  error(message: string, trace?: string, meta?: Record<string, any>) {
    this.logger.error(message, { trace, ...(meta ? { meta: sanitizeForLog(meta) } : {}) });
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(message, meta ? { meta: sanitizeForLog(meta) } : {});
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(message, meta ? { meta: sanitizeForLog(meta) } : {});
  }

  verbose(message: string, meta?: Record<string, any>) {
    this.logger.verbose(message, meta ? { meta: sanitizeForLog(meta) } : {});
  }
}
