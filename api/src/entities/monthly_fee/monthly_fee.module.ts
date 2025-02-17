// monthly_fee/monthly_fee.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Monthly_fee } from './monthly_fee.entity';
import { Monthly_feeController } from './monthly_fee.controller';
import { Monthly_feeService } from './monthly_fee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Monthly_fee])],
  controllers: [Monthly_feeController],
  providers: [Monthly_feeService],
  exports: [Monthly_feeService],
})
export class Monthly_feeModule {}
