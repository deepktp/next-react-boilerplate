import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<{ resource: string; action: string }>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('No user in request');
    if (user.isSuperAdmin) return true;

    const permSlug = `${required.resource}:${required.action}`;
    if (!user.permissions?.includes(permSlug)) {
      throw new ForbiddenException(`Missing permission: ${permSlug}`);
    }
    return true;
  }
}
