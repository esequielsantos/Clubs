// migration.module.ts
import { Module } from '@nestjs/common';
import { Migration } from 'typeorm';

@Module({
  providers: [Migration],
})
export class MigrationModule {}
