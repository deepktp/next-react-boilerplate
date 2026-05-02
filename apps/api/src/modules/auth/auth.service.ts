import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import {
  users,
  tenants,
  refreshTokens,
  passwordResetTokens,
  userTenantRoles,
  roles,
  rolePermissions,
  permissions,
} from '../../../../database/schema';
import { DB_TOKEN } from '../../database/database.module';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';
import type {
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './dto/auth.dto';
import { addHours, addDays } from '@app/utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_TOKEN) private db: any,
    private jwtService: JwtService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateTokens(user: any, tenantRoles: any[], perms: string[]) {
    const payload = {
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      isSuperAdmin: user.isSuperAdmin,
      roles: tenantRoles.map((r) => r.roleSlug),
      permissions: perms,
    };

    const accessToken = this.jwtService.sign(payload);
    const rawRefreshToken = randomBytes(32).toString('hex');

    return { accessToken, rawRefreshToken, payload };
  }

  async login(dto: LoginDto) {
    const tenantSlug = dto['tenantSlug'];

    let user: any;
    if (tenantSlug) {
      const [tenant] = await this.db
        .select()
        .from(tenants)
        .where(eq(tenants.slug, tenantSlug))
        .limit(1);
      if (!tenant) throw new UnauthorizedException('Invalid tenant');

      const [found] = await this.db
        .select()
        .from(users)
        .where(and(eq(users.email, dto.email), eq(users.tenantId, tenant.id)))
        .limit(1);
      user = found;
    } else {
      const [found] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, dto.email))
        .limit(1);
      user = found;
    }

    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== 'active') throw new UnauthorizedException('Account is not active');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const { tenantRoles, perms } = await this.getUserTenantRoles(user.id, user.tenantId);
    const { accessToken, rawRefreshToken } = this.generateTokens(user, tenantRoles, perms);

    // Store hashed refresh token
    const expiresAt = addDays(new Date(), 7);
    await this.db.insert(refreshTokens).values({
      id: uuidv4(),
      userId: user.id,
      tokenHash: this.hashToken(rawRefreshToken),
      expiresAt,
    });

    // Update last login
    await this.db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Fetch tenant details
    const [tenant] = user.tenantId
      ? await this.db.select().from(tenants).where(eq(tenants.id, user.tenantId)).limit(1)
      : [null];

    return {
      user: this.mapUserProfile(user, tenantRoles),
      tokens: {
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: 3600,
        tokenType: 'Bearer',
      },
      tenant: tenant
        ? { id: tenant.id, name: tenant.name, slug: tenant.slug }
        : undefined,
    };
  }

  async register(dto: RegisterDto) {
    const [tenant] = await this.db
      .select()
      .from(tenants)
      .where(eq(tenants.slug, dto.tenantSlug))
      .limit(1);

    if (!tenant) throw new BadRequestException('Tenant not found');

    const [existing] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.email, dto.email), eq(users.tenantId, tenant.id)))
      .limit(1);

    if (existing) throw new ConflictException('User already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const userId = uuidv4();

    await this.db.insert(users).values({
      id: userId,
      tenantId: tenant.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      status: 'active',
      emailVerified: false,
      phone: dto.phone,
    });

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const { tenantRoles, perms } = await this.getUserTenantRoles(user.id, user.tenantId);
    const { accessToken, rawRefreshToken } = this.generateTokens(user, tenantRoles, perms);

    const expiresAt = addDays(new Date(), 7);
    await this.db.insert(refreshTokens).values({
      id: uuidv4(),
      userId: user.id,
      tokenHash: this.hashToken(rawRefreshToken),
      expiresAt,
    });

    return {
      user: this.mapUserProfile(user, tenantRoles),
      tokens: {
        accessToken,
        refreshToken: rawRefreshToken,
        expiresIn: 3600,
        tokenType: 'Bearer',
      },
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const tokenHash = this.hashToken(dto.refreshToken);

    const [token] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Delete used token (rotation)
    await this.db.delete(refreshTokens).where(eq(refreshTokens.id, token.id));

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, token.userId))
      .limit(1);

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('User account is not active');
    }

    const { tenantRoles, perms } = await this.getUserTenantRoles(user.id, user.tenantId);
    const { accessToken, rawRefreshToken } = this.generateTokens(user, tenantRoles, perms);

    const expiresAt = addDays(new Date(), 7);
    await this.db.insert(refreshTokens).values({
      id: uuidv4(),
      userId: user.id,
      tokenHash: this.hashToken(rawRefreshToken),
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await this.db.delete(refreshTokens).where(
        and(eq(refreshTokens.userId, userId), eq(refreshTokens.tokenHash, tokenHash)),
      );
    } else {
      // Revoke all refresh tokens for this user
      await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    // Never reveal if user exists
    if (!user) return { message: 'If that email exists, a reset link has been sent.' };

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = addHours(new Date(), 1);

    await this.db.insert(passwordResetTokens).values({
      id: uuidv4(),
      userId: user.id,
      tokenHash,
      expiresAt,
      used: false,
    });

    // In production, send email instead
    if (process.env.NODE_ENV !== 'production') {
      return { message: 'Reset token (dev only)', token: rawToken };
    }
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);

    const [token] = await this.db
      .select()
      .from(passwordResetTokens)
      .where(and(eq(passwordResetTokens.tokenHash, tokenHash), eq(passwordResetTokens.used, false)))
      .limit(1);

    if (!token || token.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, token.userId));

    // Mark token as used and revoke all refresh tokens
    await this.db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, token.id));
    await this.db.delete(refreshTokens).where(eq(refreshTokens.userId, token.userId));

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');

    const { tenantRoles } = await this.getUserTenantRoles(user.id, user.tenantId);
    return this.mapUserProfile(user, tenantRoles);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.db
      .update(users)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return this.getProfile(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.db
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return { message: 'Password changed successfully' };
  }

  async validateJwtPayload(payload: any) {
    return payload;
  }

  async getUserTenantRoles(userId: string, tenantId: string) {
    if (!tenantId) return { tenantRoles: [], perms: [] };

    const rows = await this.db
      .select({
        roleId: roles.id,
        roleName: roles.name,
        roleSlug: roles.slug,
        roleScope: roles.scope,
        roleLevel: roles.level,
        permissionSlug: permissions.slug,
      })
      .from(userTenantRoles)
      .innerJoin(roles, eq(userTenantRoles.roleId, roles.id))
      .leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(
        and(eq(userTenantRoles.userId, userId), eq(userTenantRoles.tenantId, tenantId)),
      );

    const roleMap = new Map<string, any>();
    for (const row of rows) {
      if (!roleMap.has(row.roleId)) {
        roleMap.set(row.roleId, {
          roleId: row.roleId,
          roleName: row.roleName,
          roleSlug: row.roleSlug,
          roleScope: row.roleScope,
          roleLevel: row.roleLevel,
          permissions: [],
        });
      }
      if (row.permissionSlug) {
        roleMap.get(row.roleId).permissions.push(row.permissionSlug);
      }
    }

    const tenantRoles = Array.from(roleMap.values());
    const perms = [...new Set(tenantRoles.flatMap((r) => r.permissions))];
    return { tenantRoles, perms };
  }

  private mapUserProfile(user: any, tenantRoles: any[]) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      phone: user.phone,
      tenantId: user.tenantId,
      status: user.status,
      emailVerified: user.emailVerified,
      isSuperAdmin: user.isSuperAdmin,
      roles: tenantRoles,
    };
  }
}
