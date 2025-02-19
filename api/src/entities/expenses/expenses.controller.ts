//expenses.controller
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Expenses } from './expenses.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  async getAllActiveExpenses(): Promise<Expenses[]> {
    return await this.expensesService.getAllExpenses();
  }

  @Get(':id')
  async getExpenseById(@Param('id') id: number): Promise<Expenses | null> {
    return await this.expensesService.getExpenseById(id);
  }

  @Get(':id/members')
  async getMembersByExpenseId(
    @Param('id') id: number,
  ): Promise<Expenses[] | null> {
    return await this.expensesService.getMembersByExpenseId(id);
  }

  @Post()
  async createExpense(@Body() expense: Expenses): Promise<Expenses> {
    return await this.expensesService.createExpense(expense);
  }

  @Patch(':id')
  async updateExpense(
    @Param('id') id: number,
    @Body() expense: Expenses,
  ): Promise<UpdateResult> {
    return await this.expensesService.updateExpense(id, expense);
  }

  @Delete(':id')
  async deleteExpense(@Param('id') id: number): Promise<DeleteResult> {
    return await this.expensesService.deleteExpense(id);
  }
}
