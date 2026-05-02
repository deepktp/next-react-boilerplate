import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/app-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = AppLogger.getInstance();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const body = {
      success: false,
      error: {
        code: status === 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR',
        message,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: (request as any).requestId,
        path: request.url,
      },
    };

    this.logger?.error('http_exception', undefined, {
      status,
      message,
      path: request.url,
      method: request.method,
    });

    response.status(status).json(body);
  }
}
