import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { CustomLogger } from './logger/CustomLogger';

async function bootstrap() {
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
  app.useLogger(new CustomLogger());
  await app.listen(5000);
}
bootstrap();

