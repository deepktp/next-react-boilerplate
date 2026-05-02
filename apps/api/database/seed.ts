import { db } from './db';
import { tenants, users, roles, permissions, userTenantRoles, rolePermissions } from './schema';
import { hashPassword } from '@app/utils';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding database...');

  // 1. Create default tenant
  const tenantId = uuidv4();
  await db.insert(tenants).values({
    id: tenantId,
    name: 'Default Tenant',
    slug: 'default',
    status: 'active',
    contactEmail: 'admin@example.com',
    settings: JSON.stringify({}),
  }).onDuplicateKeyUpdate({ set: { name: 'Default Tenant' } });

  // 2. Seed system roles
  const superAdminRoleId = uuidv4();
  const tenantAdminRoleId = uuidv4();
  const orgAdminRoleId = uuidv4();
  const orgUserRoleId = uuidv4();
  const viewerRoleId = uuidv4();

  await db.insert(roles).values([
    { id: superAdminRoleId, tenantId: null as any, name: 'Super Admin', slug: 'super-admin', scope: 'platform', level: 0, isSystem: true, status: 'active' },
    { id: tenantAdminRoleId, tenantId, name: 'Tenant Admin', slug: 'tenant-admin', scope: 'tenant', level: 1, isSystem: true, status: 'active' },
    { id: orgAdminRoleId, tenantId, name: 'Org Admin', slug: 'org-admin', scope: 'organization', level: 3, isSystem: true, status: 'active' },
    { id: orgUserRoleId, tenantId, name: 'Org User', slug: 'org-user', scope: 'organization', level: 4, isSystem: true, status: 'active' },
    { id: viewerRoleId, tenantId, name: 'Viewer', slug: 'viewer', scope: 'organization', level: 5, isSystem: true, status: 'active' },
  ]).onDuplicateKeyUpdate({ set: { name: 'Super Admin' } });

  // 3. Seed system permissions
  const resources = ['users', 'roles', 'organizations', 'settings'];
  const actions = ['create', 'read', 'update', 'delete', 'manage'] as const;
  const permissionRows = [];
  for (const resource of resources) {
    for (const action of actions) {
      permissionRows.push({
        id: uuidv4(),
        name: `${resource}:${action}`,
        slug: `${resource}:${action}`,
        resource,
        action,
        isSystem: true,
        scope: 'tenant' as const,
      });
    }
  }
  for (const perm of permissionRows) {
    await db.insert(permissions).values(perm).onDuplicateKeyUpdate({ set: { name: perm.name } });
  }

  // 4. Create super-admin user
  const adminId = uuidv4();
  const passwordHash = await hashPassword('Admin@1234');
  await db.insert(users).values({
    id: adminId,
    tenantId,
    email: 'admin@example.com',
    firstName: 'Super',
    lastName: 'Admin',
    passwordHash,
    isSuperAdmin: true,
    status: 'active',
    emailVerified: true,
  }).onDuplicateKeyUpdate({ set: { email: 'admin@example.com' } });

  // 5. Assign tenant-admin role to super-admin user
  await db.insert(userTenantRoles).values({
    id: uuidv4(),
    userId: adminId,
    tenantId,
    roleId: tenantAdminRoleId,
    assignedBy: adminId,
  }).onDuplicateKeyUpdate({ set: { roleId: tenantAdminRoleId } });

  console.log('Seed completed!');
  console.log('  Super admin: admin@example.com / Admin@1234');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed!', err);
  process.exit(1);
});
