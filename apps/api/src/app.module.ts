import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { OrganizationMiddleware } from './common/middleware/organization.middleware';
import { SanitizeMiddleware } from './common/middleware/sanitize.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { AppLogger } from './common/logger/app-logger.service';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';
import { RequestContextService } from './common/logger/request-context.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL) || 60,
        limit: Number(process.env.RATE_LIMIT_LIMIT) || 100,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    OrganizationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    AppLogger,
    RequestContextService,
    RequestIdMiddleware,
    RequestIdInterceptor,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
  ],
  exports: [AppLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        TenantMiddleware,
        OrganizationMiddleware,
        SanitizeMiddleware,
      )
      .forRoutes('*');
  }
}
