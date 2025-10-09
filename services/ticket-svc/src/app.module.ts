/**
 * App module for ticket-svc
 * - AuthModule + global JwtAuthGuard (same behavior as asset-svc)
 * - Middlewares: TenantMiddleware -> IdempotencyMiddleware -> MetricsMiddleware
 * - Controllers: TicketController (+ HealthController if you have one)
 * - Providers: TicketNumberService, AuditService, JwtAuthGuard (as APP_GUARD)
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';

import { TicketController } from './ticket.controller';
import { TicketNumberService } from './ticket-number.service';
import { AuditService } from './shared/audit.service';
import { IdempotencyMiddleware } from './shared/idempotency.middleware';
import { MetricsMiddleware } from './shared/metrics.middleware';
import { HealthController } from './health.controller';

@Module({
  imports: [AuthModule],
  controllers: [TicketController, HealthController],
  providers: [
    TicketNumberService,
    AuditService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware, MetricsMiddleware).forRoutes('*');
  }
}
