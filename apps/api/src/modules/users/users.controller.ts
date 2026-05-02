import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { TenantId, CurrentUser } from '../../common/decorators/user.decorator';
import { RequireRoleLevel } from '../../common/decorators/role-level.decorator';
import { RoleLevelGuard } from '../../common/guards/role-level.guard';
import { successResponse } from '@app/utils';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleLevelGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequireRoleLevel(2) // TENANT_MANAGER or above
  async findAll(@TenantId() tenantId: string) {
    const data = await this.usersService.findAll(tenantId);
    return successResponse(data);
  }

  @Get(':id')
  @RequireRoleLevel(2)
  async findOne(@Param('id') id: string, @TenantId() tenantId: string) {
    const data = await this.usersService.findOne(id, tenantId);
    return successResponse(data);
  }

  @Patch(':id')
  @RequireRoleLevel(1) // TENANT_ADMIN or above
  async update(
    @Param('id') id: string,
    @TenantId() tenantId: string,
    @Body() body: any,
  ) {
    const data = await this.usersService.update(id, tenantId, body);
    return successResponse(data);
  }

  @Delete(':id')
  @RequireRoleLevel(1)
  async remove(@Param('id') id: string, @TenantId() tenantId: string) {
    const data = await this.usersService.remove(id, tenantId);
    return successResponse(data);
  }
}
