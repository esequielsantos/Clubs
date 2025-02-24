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

  async createMinutes(minutes: Minutes): Promise<Minutes> {
    return await this.minutesRepository.save(minutes);
  }

  async getAllMinutes(): Promise<Minutes[]> {
    return await this.minutesRepository.find();
  }

  getMinutesData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return Promise.resolve([
      { field: 'id', type: 'number' },
      { field: 'content', type: 'string' },
      { field: 'club_id', type: 'number', foreignKey: true },
      { field: 'createdBy', type: 'number', foreignKey: true },
      { field: 'createdAt', type: 'Date' },
      { field: 'updatedBy', type: 'number', foreignKey: true },
      { field: 'updatedAt', type: 'Date' },
      { field: 'final', type: 'boolean' },
      { field: 'status', type: 'boolean' },
    ]);
  }

  async getMembersByMinutesId(id: number): Promise<Minutes[]> {
    return await this.minutesRepository
      .createQueryBuilder('minutes')
      .innerJoinAndSelect('minutes.membersOf', 'membersOf')
      .where('minutes.id = :id', { id })
      .select(['membersOf.*', 'minutes.name', 'minutes.description'])
      .getRawMany();
  }

  async getMinutesById(id: number): Promise<Minutes | null> {
    return await this.minutesRepository.findOneById(id);
  }

  async updateMinutes(id: number, minutes: Minutes): Promise<UpdateResult> {
    return await this.minutesRepository.update(id, minutes);
  }

  async deleteMinutes(id: number): Promise<DeleteResult> {
    return await this.softDelete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    const minutes = await this.getMinutesById(id);
    if (minutes) {
      minutes.status = false;
      return await this.updateMinutes(id, minutes);
    } else {
      throw new Error(`Minute with ID ${id} not Found.`);
    }
  }
}
