//balance.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Balance } from './balance.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
  ) {}

  async createBalance(expense: Balance): Promise<Balance> {
    return await this.balanceRepository.save(expense);
  }

  async getAllBalance(): Promise<Balance[]> {
    return await this.balanceRepository.find();
  }

  getBalanceData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return Promise.resolve([
      { field: 'id', type: 'number' },
      { field: 'name', type: 'string' },
      { field: 'description', type: 'string' },
      { field: 'amount', type: 'number' },
      { field: 'date', type: 'Date' },
      { field: 'membersOf', type: 'array', foreignKey: true },
    ]);
  }

  async getMembersByBalanceId(id: number): Promise<Balance[]> {
    return await this.balanceRepository
      .createQueryBuilder('expense')
      .innerJoinAndSelect('expense.membersOf', 'membersOf')
      .where('expense.id = :id', { id })
      .select(['membersOf.*', 'expense.name', 'expense.description'])
      .getRawMany();
  }

  async getBalanceById(id: number): Promise<Balance | null> {
    return await this.balanceRepository.findOneById(id);
  }

  async updateBalance(id: number, expense: Balance): Promise<UpdateResult> {
    return await this.balanceRepository.update(id, expense);
  }

  async deleteBalance(id: number): Promise<DeleteResult> {
    return await this.balanceRepository.delete(id);
  }
}
