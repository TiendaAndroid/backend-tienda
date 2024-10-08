import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody:true
  });
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('zazil_backend/api');
  app.enableCors();
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(envs.port);

  logger.log(`>> Application run in ${await app.getUrl()}`);
}
bootstrap();
