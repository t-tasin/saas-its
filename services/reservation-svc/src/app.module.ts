/**
 * App module for reservation-svc
 * - AuthModule + global JwtAuthGuard + RolesGuard
 * - Controllers: ReservationController, HealthController
 * - Providers: ReservationService, Guards
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';

import { ReservationController } from './reservation.controller';
import { AnalyticsController } from './analytics.controller';
import { ReservationService } from './reservation.service';
import { HealthController } from './health.controller';

import { IdempotencyMiddleware } from './shared/idempotency.middleware';
import { MetricsMiddleware } from './shared/metrics.middleware';

@Module({
  imports: [AuthModule],
  controllers: [ReservationController, AnalyticsController, HealthController],
  providers: [
    ReservationService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware, MetricsMiddleware).forRoutes('*');
  }
}

