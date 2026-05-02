import type { BaseEntity, Status } from './common';

export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  domain?: string;
  status: Status;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  logoUrl?: string;
  settings: TenantSettings;
  metadata?: Record<string, any>;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
}

export interface TenantSettings {
  timezone?: string;
  dateFormat?: string;
  currency?: string;
  [key: string]: any;
}

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}
