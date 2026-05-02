import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { TenantId } from '../../common/decorators/user.decorator';
import { successResponse } from '@app/utils';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(@TenantId() tenantId: string) {
    const data = await this.rolesService.findAll(tenantId);
    return successResponse(data);
  }

  @Get('permissions')
  async findAllPermissions() {
    const data = await this.rolesService.findAllPermissions();
    return successResponse(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.rolesService.findOne(id);
    return successResponse(data);
  }
}
