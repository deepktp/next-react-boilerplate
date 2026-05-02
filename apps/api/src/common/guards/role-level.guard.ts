import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ROLE_LEVEL_KEY } from '../decorators/role-level.decorator';

@Injectable()
export class RoleLevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const maxLevel = this.reflector.getAllAndOverride<number>(REQUIRE_ROLE_LEVEL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (maxLevel === undefined || maxLevel === null) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No user in request');
    if (user.isSuperAdmin) return true;

    const tenantRoles: { roleLevel: number }[] = user.tenantRoles || [];
    const hasRole = tenantRoles.some((r) => r.roleLevel <= maxLevel);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient role level');
    }
    return true;
  }
}
