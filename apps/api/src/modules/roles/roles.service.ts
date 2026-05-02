import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { roles, permissions, rolePermissions } from '../../../../database/schema';
import { DB_TOKEN } from '../../database/database.module';

@Injectable()
export class RolesService {
  constructor(@Inject(DB_TOKEN) private db: any) {}

  async findAll(tenantId: string) {
    return this.db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId)));
  }

  async findOne(id: string) {
    const [role] = await this.db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!role) throw new NotFoundException('Role not found');

    const perms = await this.db
      .select({ permission: permissions })
      .from(rolePermissions)
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(rolePermissions.roleId, id));

    return { ...role, permissions: perms.map((p: any) => p.permission) };
  }

  async findAllPermissions() {
    return this.db.select().from(permissions);
  }
}
