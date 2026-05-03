import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { organizations, organizationUsers } from '../../../database/schema';
import { DB_TOKEN } from '../../database/database.module';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DB_TOKEN) private db: any) {}

  async findAll(tenantId: string) {
    return this.db
      .select()
      .from(organizations)
      .where(and(eq(organizations.tenantId, tenantId)));
  }

  async findOne(id: string, tenantId: string) {
    const [org] = await this.db
      .select()
      .from(organizations)
      .where(and(eq(organizations.id, id), eq(organizations.tenantId, tenantId)))
      .limit(1);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async create(tenantId: string, dto: { name: string; orgType?: string; contactEmail?: string; contactPhone?: string }) {
    const id = uuidv4();
    await this.db.insert(organizations).values({
      id,
      tenantId,
      name: dto.name,
      orgType: (dto.orgType as any) || 'COMPANY',
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone,
    });
    return this.findOne(id, tenantId);
  }

  async update(id: string, tenantId: string, dto: Partial<typeof organizations.$inferInsert>) {
    await this.findOne(id, tenantId);
    await this.db
      .update(organizations)
      .set({ ...dto, updatedAt: new Date() })
      .where(and(eq(organizations.id, id), eq(organizations.tenantId, tenantId)));
    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.db
      .update(organizations)
      .set({ deletedAt: new Date(), isActive: false })
      .where(and(eq(organizations.id, id), eq(organizations.tenantId, tenantId)));
    return { success: true };
  }

  async getMembers(orgId: string) {
    return this.db.select().from(organizationUsers).where(eq(organizationUsers.organizationId, orgId));
  }
}
