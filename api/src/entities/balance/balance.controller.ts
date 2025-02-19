//balance.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from './balance.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  async getAllActiveBalance(): Promise<Balance[]> {
    return await this.balanceService.getAllBalance();
  }

  @Get(':id')
  async getBalanceById(@Param('id') id: number): Promise<Balance | null> {
    return await this.balanceService.getBalanceById(id);
  }

  @Get(':id/members')
  async getMembersByBalanceId(
    @Param('id') id: number,
  ): Promise<Balance[] | null> {
    return await this.balanceService.getMembersByBalanceId(id);
  }

  @Post()
  async createBalance(@Body() expense: Balance): Promise<Balance> {
    return await this.balanceService.createBalance(expense);
  }

  @Patch(':id')
  async updateBalance(
    @Param('id') id: number,
    @Body() expense: Balance,
  ): Promise<UpdateResult> {
    return await this.balanceService.updateBalance(id, expense);
  }

  @Delete(':id')
  async deleteBalance(@Param('id') id: number): Promise<DeleteResult> {
    return await this.balanceService.deleteBalance(id);
  }
}
