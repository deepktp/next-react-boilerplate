import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AppLogger } from '../logger/app-logger.service';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  private logger = AppLogger.getInstance();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const requestId = req.requestId;

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          data.metadata = { ...(data.metadata || {}), requestId };
        }
        return data;
      }),
      tap((body) => {
        const res = context.switchToHttp().getResponse();
        this.logger?.log('outgoing_response', {
          requestId,
          statusCode: res.statusCode,
        });
      }),
    );
  }
}
