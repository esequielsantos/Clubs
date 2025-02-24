//incomes.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { Incomes } from './incomes.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Get()
  async getAllActiveIncomes(): Promise<Incomes[]> {
    return await this.incomesService.getAllIncomes();
  }

  @Get('/data')
  async getIncomesData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.incomesService.getIncomesData();
  }

  @Get('/data')
  async getlIncomesData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return await this.incomesService.getIncomesData();
  }

  @Get(':id')
  async getIncomeById(@Param('id') id: number): Promise<Incomes | null> {
    return await this.incomesService.getIncomeById(id);
  }

  @Get(':id/members')
  async getMembersByIncomeId(
    @Param('id') id: number,
  ): Promise<Incomes[] | null> {
    return await this.incomesService.getMembersByIncomeId(id);
  }

  @Post()
  async createIncome(@Body() income: Incomes): Promise<Incomes> {
    return await this.incomesService.createIncome(income);
  }

  @Patch(':id')
  async updateIncome(
    @Param('id') id: number,
    @Body() income: Incomes,
  ): Promise<UpdateResult> {
    return await this.incomesService.updateIncome(id, income);
  }

  @Delete(':id')
  async deleteIncome(@Param('id') id: number): Promise<DeleteResult> {
    return await this.incomesService.deleteIncome(id);
  }
}
