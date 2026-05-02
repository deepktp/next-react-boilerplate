import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { successResponse } from '@app/utils';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return successResponse(data);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return successResponse(data);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshTokenDto) {
    const data = await this.authService.refreshToken(dto);
    return successResponse(data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async logout(@CurrentUser() user: any, @Body() body: Partial<RefreshTokenDto>) {
    const data = await this.authService.logout(user.userId, body.refreshToken);
    return successResponse(data);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const data = await this.authService.forgotPassword(dto);
    return successResponse(data);
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const data = await this.authService.resetPassword(dto);
    return successResponse(data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@CurrentUser() user: any) {
    const data = await this.authService.getProfile(user.userId);
    return successResponse(data);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    const data = await this.authService.updateProfile(user.userId, dto);
    return successResponse(data);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async changePassword(@CurrentUser() user: any, @Body() dto: ChangePasswordDto) {
    const data = await this.authService.changePassword(user.userId, dto);
    return successResponse(data);
  }
}
