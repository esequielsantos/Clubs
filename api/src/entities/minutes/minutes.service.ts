//minutes.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Minutes } from './minutes.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class MinutesService {
  constructor(
    @InjectRepository(Minutes)
    private readonly minutesRepository: Repository<Minutes>,
  ) {}

  async createMinutes(expense: Minutes): Promise<Minutes> {
    return await this.minutesRepository.save(expense);
  }

  async getAllMinutes(): Promise<Minutes[]> {
    return await this.minutesRepository.find();
  }

  async getMembersByMinutesId(id: number): Promise<Minutes[]> {
    return await this.minutesRepository
      .createQueryBuilder('expense')
      .innerJoinAndSelect('expense.membersOf', 'membersOf')
      .where('expense.id = :id', { id })
      .select(['membersOf.*', 'expense.name', 'expense.description'])
      .getRawMany();
  }

  async getMinutesById(id: number): Promise<Minutes | null> {
    return await this.minutesRepository.findOneById(id);
  }

  async updateMinutes(id: number, expense: Minutes): Promise<UpdateResult> {
    return await this.minutesRepository.update(id, expense);
  }

  async deleteMinutes(id: number): Promise<DeleteResult> {
    return await this.minutesRepository.delete(id);
  }
}
