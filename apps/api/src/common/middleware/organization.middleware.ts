import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OrganizationMiddleware implements NestMiddleware {
  use(req: Request & { organizationId?: string }, res: Response, next: NextFunction) {
    const orgId = req.headers['x-organization-id'] as string | undefined;
    if (orgId) {
      req.organizationId = orgId;
    }
    next();
  }
}
