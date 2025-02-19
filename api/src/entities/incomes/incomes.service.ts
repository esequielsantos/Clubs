//incomes.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Incomes } from './incomes.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Incomes)
    private readonly incomesRepository: Repository<Incomes>,
  ) {}

  async createIncome(income: Incomes): Promise<Incomes> {
    return await this.incomesRepository.save(income);
  }

  async getAllIncomes(): Promise<Incomes[]> {
    return await this.incomesRepository.find();
  }

  async getMembersByIncomeId(id: number): Promise<Incomes[]> {
    return await this.incomesRepository
      .createQueryBuilder('income')
      .innerJoinAndSelect('income.membersOf', 'membersOf')
      .where('income.id = :id', { id })
      .select(['membersOf.*', 'income.name', 'income.description'])
      .getRawMany();
  }

  async getIncomeById(id: number): Promise<Incomes | null> {
    return await this.incomesRepository.findOneById(id);
  }

  async updateIncome(id: number, income: Incomes): Promise<UpdateResult> {
    return await this.incomesRepository.update(id, income);
  }

  async deleteIncome(id: number): Promise<DeleteResult> {
    return await this.incomesRepository.delete(id);
  }
}
