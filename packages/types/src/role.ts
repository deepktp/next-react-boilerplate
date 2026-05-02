import type { BaseEntity, Status } from './common';
import type { Permission } from './permission';

export interface Role extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  tenantId: string;
  isSystem: boolean;
  status: Status;
  scope: 'platform' | 'tenant' | 'organization';
  permissions: Permission[];
  level: RoleLevel;
}

export enum RoleLevel {
  SUPER_ADMIN = 0,
  TENANT_ADMIN = 1,
  TENANT_MANAGER = 2,
  ORG_ADMIN = 3,
  ORG_USER = 4,
  VIEWER = 5,
}
