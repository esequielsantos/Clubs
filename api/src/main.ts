import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });

  app.use(cookieParser());

  const port = process.env.PORT ?? 3100;
  console.log(`Server running on port ${port}`);
  await app.listen(port);
}
void bootstrap();
