/**
 * Bootstraps Nest app with:
 * - Global ValidationPipe (whitelist, forbid unknown)
 * - Global error filter with uniform { error: { code, message } }
 * - CORS for http://localhost:3000
 * - Swagger (dev only) at /docs and /openapi.json
 */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3004'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id', 'Idempotency-Key'],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger temporarily disabled due to metadata issues
  // if (process.env.NODE_ENV !== 'production') {
  //   const config = new DocumentBuilder()
  //     .setTitle('SaaS ITS API')
  //     .setVersion('1.0')
  //     .addBearerAuth()
  //     .build();
  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup('docs', app, document);
  // }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Asset Service running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
