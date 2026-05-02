import type { UserProfile } from './user';

export interface LoginDto {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantSlug: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  iat?: number;
  exp?: number;
}
