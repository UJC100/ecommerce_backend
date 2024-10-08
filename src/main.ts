import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials:true
  })

  // app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(2022);
}
bootstrap();
