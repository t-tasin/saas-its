/**
 * App module for asset-svc
 * - AuthModule + global JwtAuthGuard + RolesGuard
 * - Middlewares: IdempotencyMiddleware -> MetricsMiddleware
 * - Controllers: AssetController, HealthController
 * - Providers: JwtAuthGuard, RolesGuard (as APP_GUARDs), AuditService
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';

import { AssetController } from './asset.controller';
import { AnalyticsController } from './analytics.controller';
import { HealthController } from './health.controller';
import { AssetTypeController } from './asset-type.controller';

import { IdempotencyMiddleware } from './shared/idempotency.middleware';
import { MetricsMiddleware } from './shared/metrics.middleware';
import { AuditService } from './shared/audit.service';
import { MigrationService } from './migration.service';

@Module({
  imports: [AuthModule],
  controllers: [AssetController, AnalyticsController, AssetTypeController, HealthController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    AuditService,
    MigrationService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware, MetricsMiddleware).forRoutes('*');
  }
}
