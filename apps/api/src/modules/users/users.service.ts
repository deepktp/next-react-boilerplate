import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { users } from '../../../../database/schema';
import { DB_TOKEN } from '../../database/database.module';

@Injectable()
export class UsersService {
  constructor(@Inject(DB_TOKEN) private db: any) {}

  async findAll(tenantId: string) {
    return this.db.select().from(users).where(eq(users.tenantId, tenantId));
  }

  async findOne(id: string, tenantId: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)))
      .limit(1);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, tenantId: string, dto: Partial<{ firstName: string; lastName: string; status: string; phone: string }>) {
    await this.findOne(id, tenantId);
    await this.db
      .update(users)
      .set({ ...dto, updatedAt: new Date() })
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.db
      .update(users)
      .set({ deletedAt: new Date(), status: 'suspended' })
      .where(and(eq(users.id, id), eq(users.tenantId, tenantId)));
    return { success: true };
  }
}
