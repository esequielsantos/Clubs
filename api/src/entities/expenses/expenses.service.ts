//expenses.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expenses } from './expenses.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses)
    private readonly expensesRepository: Repository<Expenses>,
  ) {}

  async createExpense(expense: Expenses): Promise<Expenses> {
    return await this.expensesRepository.save(expense);
  }

  async getAllExpenses(): Promise<Expenses[]> {
    return await this.expensesRepository.find();
  }

  async getMembersByExpenseId(id: number): Promise<Expenses[]> {
    return await this.expensesRepository
      .createQueryBuilder('expense')
      .innerJoinAndSelect('expense.membersOf', 'membersOf')
      .where('expense.id = :id', { id })
      .select(['membersOf.*', 'expense.name', 'expense.description'])
      .getRawMany();
  }

  async getExpenseById(id: number): Promise<Expenses | null> {
    return await this.expensesRepository.findOneById(id);
  }

  async updateExpense(id: number, expense: Expenses): Promise<UpdateResult> {
    return await this.expensesRepository.update(id, expense);
  }

  async deleteExpense(id: number): Promise<DeleteResult> {
    return await this.expensesRepository.delete(id);
  }
}
