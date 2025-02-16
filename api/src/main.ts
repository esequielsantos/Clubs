import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Migration } from './migrations/migration.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await connectDatabase();
  await app.listen(process.env.PORT ?? 3100);
}
void bootstrap();

async function connectDatabase() {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'club_db.db',
    entities: [Migration],
    synchronize: true,
  });
}
