// management/management.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Management } from './management.entity';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
  imports: [TypeOrmModule.forFeature([Management])],
  controllers: [ManagementController],
  providers: [ManagementService],
  exports: [ManagementService],
})
export class ManagementModule {}
