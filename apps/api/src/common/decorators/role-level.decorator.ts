import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ROLE_LEVEL_KEY = 'requireRoleLevel';
// Levels: 0=SUPER_ADMIN, 1=TENANT_ADMIN, 2=TENANT_MANAGER, 3=ORG_ADMIN, 4=ORG_USER, 5=VIEWER
export const RequireRoleLevel = (maxLevel: number) =>
  SetMetadata(REQUIRE_ROLE_LEVEL_KEY, maxLevel);
