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
import middie from 'middie';
import { LoggingInterceptor } from './app/logging.interceptor';

async function bootstrap() {
  handleProcessorErrors(new CustomLogger())

  // Create app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(), 
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Bets with friends')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Implement custom logger for framework logging
  const appLogger = new CustomLogger();
  app.useLogger(appLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(appLogger));
  await app.listen(process.env.PORT);
}
bootstrap();

