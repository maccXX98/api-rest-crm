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
  // Create Fastify instance with raw body parser for WhatsApp webhook verification
  // NestJS's FastifyAdapter.registerJsonContentParser also tries to add 'application/json',
  // so we pre-configure the Fastify instance and then stub the adapter's method
  const fastify = await import('fastify');
  const fastifyInstance = fastify.default({
    logger: false,
  });

  // Preserve raw body: attach Buffer to req.rawBody before JSON parsing
  fastifyInstance.addContentTypeParser(
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

  const fastifyAdapter = new FastifyAdapter({
    instance: fastifyInstance,
    // Prevent NestJS from adding its own JSON parser (we already have one)
    jsonParser: null,
  } as any);

  // Stub registerJsonContentParser so NestJS doesn't try to add 'application/json' again
  (fastifyAdapter as any).registerJsonContentParser = () => {};

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
