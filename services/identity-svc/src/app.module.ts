import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt.guard';
import { RolesGuard } from './auth/roles.guard';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { UserService } from './user.service';
import { EmailService } from './email.service';
import { OTPService } from './otp.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IdempotencyMiddleware } from './shared/idempotency.middleware';
import { MetricsMiddleware } from './shared/metrics.middleware';

@Module({
  imports: [AuthModule],
  controllers: [AppController, HealthController],
  providers: [
    UserService,
    EmailService,
    OTPService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware, MetricsMiddleware).forRoutes('*');
  }
}
