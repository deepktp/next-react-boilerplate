import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { TenantId } from '../../common/decorators/user.decorator';
import { RequireRoleLevel } from '../../common/decorators/role-level.decorator';
import { RoleLevelGuard } from '../../common/guards/role-level.guard';
import { successResponse } from '@app/utils';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleLevelGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  async findAll(@TenantId() tenantId: string) {
    const data = await this.organizationsService.findAll(tenantId);
    return successResponse(data);
  }

  @Post()
  @RequireRoleLevel(1) // TENANT_ADMIN or above
  async create(@TenantId() tenantId: string, @Body() body: any) {
    const data = await this.organizationsService.create(tenantId, body);
    return successResponse(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    const data = await this.organizationsService.findOne(id, tenantId);
    return successResponse(data);
  }

  @Patch(':id')
  @RequireRoleLevel(1)
  async update(@Param('id') id: string, @TenantId() tenantId: string, @Body() body: any) {
    const data = await this.organizationsService.update(id, tenantId, body);
    return successResponse(data);
  }

  @Delete(':id')
  @RequireRoleLevel(1)
  async remove(@Param('id') id: string, @TenantId() tenantId: string) {
    const data = await this.organizationsService.remove(id, tenantId);
    return successResponse(data);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    const data = await this.organizationsService.getMembers(id);
    return successResponse(data);
  }
}
