import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private logger = AppLogger.getInstance();

  use(req: Request & { requestId?: string }, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    this.logger?.log('incoming_request', {
      requestId,
      method: req.method,
      path: req.path,
      ip: req.ip,
    });

    next();
  }
}
