import type { BaseEntity, Status } from './common';
import type { Role } from './role';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash?: string;
  status: Status;
  tenantId: string;
  roles: Role[];
  emailVerified: boolean;
  lastLoginAt?: Date;
  metadata?: Record<string, any>;
  avatar?: string;
  phone?: string;
}

export interface TenantRole {
  roleId: string;
  roleName: string;
  roleSlug: string;
  roleScope: 'platform' | 'tenant' | 'organization';
  roleLevel: number;
  permissions: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  phone?: string;
  tenantId: string;
  status: string;
  emailVerified: boolean;
  roles: TenantRole[];
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  roleIds: string[];
  phone?: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: Status;
  roleIds?: string[];
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
