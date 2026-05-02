import type { BaseEntity } from './common';

export interface Permission extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  resource: string;
  action: PermissionAction;
  isSystem: boolean;
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
  EXECUTE = 'execute',
}
