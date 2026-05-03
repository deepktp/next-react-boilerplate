import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { sanitizeForLog } from '../logger/log-utils';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'database/db';
import { auditLogs } from 'database/schema';

const AUDITED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (!AUDITED_METHODS.has(req.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((responseBody) => {
        // Fire-and-forget audit log
        setImmediate(async () => {
          try {
            const method = req.method;
            const action =
              method === 'POST'
                ? 'create'
                : method === 'DELETE'
                  ? 'delete'
                  : 'update';

            await db.insert(auditLogs).values({
              id: uuidv4(),
              tenantId: req.tenantId || null,
              actorUserId: req.user?.userId || null,
              action: action as any,
              entityType: req.path.split('/').filter(Boolean)[1] || 'unknown',
              entityId: req.params?.id || null,
              afterData: sanitizeForLog(responseBody) as any,
              ipAddress: req.ip,
              userAgent: req.headers['user-agent']?.slice(0, 500),
            });
          } catch {
            // Audit log failure must not affect response
          }
        });
      }),
    );
  }
}
