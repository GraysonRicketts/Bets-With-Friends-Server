import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomLogger } from './logger/CustomLogger';
import {} from 'dotenv/config';
import { handleProcessorErrors } from './processError';
import { LoggingInterceptor, TraceContext } from './logger/logging.interceptor';
import { AsyncLocalStorage } from 'async_hooks';
import { PrismaService } from './prisma/prisma.service';
import { PORT, URL } from './env/env.constants';
import { ValidationPipe } from '@nestjs/common';
import { isProd } from './env/env.util';
import helmet from 'helmet';

export const ALS = new AsyncLocalStorage<TraceContext>();

async function bootstrap() {
  handleProcessorErrors(new CustomLogger());

  // Create app
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bets with friends')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Implement custom logger for framework logging
  const appLogger = await app.resolve(CustomLogger);
  appLogger.setContext('App');
  app.useLogger(appLogger);

  app.useGlobalInterceptors(
    new LoggingInterceptor(await app.resolve(CustomLogger)),
  );

  // See https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Add security headers
  await app.use(helmet());

  // Add validation pipes for app
  app.useGlobalPipes(new ValidationPipe());

  const port = PORT || 5000;

  // Have to do custom URL stuff to get fastify to work with Heroku
  let url = URL;
  if (!url && isProd()) {
    url = '0.0.0.0';
  }

  await app.listen(port, url || 'localhost');
  appLogger.log(`Listening at ${await app.getUrl()}`);
}
bootstrap();
