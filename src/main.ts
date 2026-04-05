import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception.filter';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // Preserve raw body for WhatsApp webhook signature verification
  // MUST be before JSON parsing
  fastifyAdapter
    .getInstance()
    .addContentTypeParser(
      'application/json',
      { parseAs: 'buffer' },
      (
        req: any,
        body: Buffer,
        done: (err: Error | null, json?: unknown) => void,
      ) => {
        try {
          req.rawBody = body;
          const json = JSON.parse(body.toString());
          done(null, json);
        } catch (err) {
          done(err as Error);
        }
      },
    );

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  await app.listen(3000, '0.0.0.0');
}

bootstrap();
