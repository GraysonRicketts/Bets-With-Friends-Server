import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomLogger } from './logger/CustomLogger';
import {} from 'dotenv/config';
import { handleProcessorErrors } from './processError';
import { LoggingInterceptor, TraceContext } from './logger/logging.interceptor';
import { AsyncLocalStorage } from 'async_hooks';
import { PrismaService } from './prisma/prisma.service';
import { PORT } from './env/env.constants';
import { fastifyHelmet } from 'fastify-helmet';
import { ValidationPipe } from '@nestjs/common';

export const ALS = new AsyncLocalStorage<TraceContext>();

async function bootstrap() {
  handleProcessorErrors(new CustomLogger())

  // Create app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true }
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bets with friends')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Implement custom logger for framework logging
  const appLogger = await app.resolve(CustomLogger)
  appLogger.setContext('App')
  app.useLogger(appLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger));

  // See https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app)

  // Add security headers
  await app.register(fastifyHelmet);

  // Add validation pipes for app
  app.useGlobalPipes(new ValidationPipe());

  // Set global router prefix
  app.setGlobalPrefix('api/v1');

  appLogger.log(`port ${PORT}:${process.env.PORT}`)

  await app.listen(PORT || 5000);
}
bootstrap();

