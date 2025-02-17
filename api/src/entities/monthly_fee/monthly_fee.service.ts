//monthly_fee.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Monthly_fee } from './monthly_fee.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class Monthly_feeService {
  constructor(
    @InjectRepository(Monthly_fee)
    private readonly monthly_feeRepository: Repository<Monthly_fee>,
  ) {}

  async createMonthly_fee(monthly_fee: Monthly_fee): Promise<Monthly_fee> {
    return await this.monthly_feeRepository.save(monthly_fee);
  }

  async getAllMonthly_fee(): Promise<Monthly_fee[]> {
    return await this.monthly_feeRepository.find();
  }

  async getMembersByMonthly_feeId(id: number): Promise<Monthly_fee[]> {
    return await this.monthly_feeRepository
      .createQueryBuilder('monthly_fee')
      .innerJoinAndSelect('monthly_fee.membersOf', 'membersOf')
      .where('monthly_fee.id = :id', { id })
      .select(['membersOf.*', 'monthly_fee.name', 'monthly_fee.description'])
      .getRawMany();
  }

  async getMonthly_feeById(id: number): Promise<Monthly_fee | null> {
    return await this.monthly_feeRepository.findOneById(id);
  }

  async updateMonthly_fee(
    id: number,
    monthly_fee: Monthly_fee,
  ): Promise<UpdateResult> {
    return await this.monthly_feeRepository.update(id, monthly_fee);
  }

  async deleteMonthly_fee(id: number): Promise<DeleteResult> {
    return await this.monthly_feeRepository.delete(id);
  }
}
