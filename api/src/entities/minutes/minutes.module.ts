// minutes/minutes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Minutes } from './minutes.entity';
import { MinutesController } from './minutes.controller';
import { MinutesService } from './minutes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Minutes])],
  controllers: [MinutesController],
  providers: [MinutesService],
  exports: [MinutesService],
})
export class MinutesModule {}
