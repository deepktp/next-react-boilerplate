import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { db } from '../../../../database/db';
import { tenants } from '../../../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  async use(req: Request & { tenantId?: string; tenant?: any }, res: Response, next: NextFunction) {
    const tenantSlug = req.headers['x-tenant-slug'] as string | undefined;

    if (!tenantSlug) {
      return next();
    }

    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, tenantSlug))
      .limit(1);

    if (!tenant || tenant.status !== 'active' || tenant.deletedAt) {
      throw new UnauthorizedException('Invalid or inactive tenant');
    }

    req.tenantId = tenant.id;
    req.tenant = tenant;
    next();
  }
}
