//monthly_fee.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Monthly_feeService } from './monthly_fee.service';
import { Monthly_fee } from './monthly_fee.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('monthly_fee')
export class Monthly_feeController {
  constructor(private readonly monthly_feeService: Monthly_feeService) {}

  @Get()
  async getAllActiveMonthly_fee(): Promise<Monthly_fee[]> {
    return await this.monthly_feeService.getAllMonthly_fee();
  }

  @Get(':id')
  async getMonthly_feeById(
    @Param('id') id: number,
  ): Promise<Monthly_fee | null> {
    return await this.monthly_feeService.getMonthly_feeById(id);
  }

  @Get(':id/members')
  async getMembersByMonthly_feeId(
    @Param('id') id: number,
  ): Promise<Monthly_fee[] | null> {
    return await this.monthly_feeService.getMembersByMonthly_feeId(id);
  }

  @Post()
  async createMonthly_fee(@Body() profile: Monthly_fee): Promise<Monthly_fee> {
    return await this.monthly_feeService.createMonthly_fee(profile);
  }

  @Patch(':id')
  async updateMonthly_fee(
    @Param('id') id: number,
    @Body() profile: Monthly_fee,
  ): Promise<UpdateResult> {
    return await this.monthly_feeService.updateMonthly_fee(id, profile);
  }

  @Delete(':id')
  async deleteMonthly_fee(@Param('id') id: number): Promise<DeleteResult> {
    return await this.monthly_feeService.deleteMonthly_fee(id);
  }
}
