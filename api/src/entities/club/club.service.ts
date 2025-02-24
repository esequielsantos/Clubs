//club.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './club.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async createClub(expense: Club): Promise<Club> {
    return await this.clubRepository.save(expense);
  }

  async getAllClub(): Promise<Club[]> {
    return await this.clubRepository.find();
  }

  getClubData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return Promise.resolve([
      { field: 'id', type: 'number' },
      { field: 'name', type: 'string' },
      { field: 'foundation_date', type: 'Date' },
      { field: 'weekday_when', type: 'number' },
      { field: 'hour_when', type: 'string' },
      { field: 'description', type: 'string' },
      { field: 'language', type: 'string' },
      { field: 'phone_number', type: 'string' },
      { field: 'id_rotary', type: 'number' },
      { field: 'district', type: 'number' },
      { field: 'zone', type: 'number' },
      { field: 'address_id', type: 'number', foreignKey: true },
      { field: 'email', type: 'string' },
      { field: 'website', type: 'string' },
      { field: 'phone', type: 'string' },
      { field: 'mail_address_id', type: 'number', foreignKey: true },
      { field: 'sponsor_id', type: 'number', foreignKey: true },
      { field: 'members', type: 'array', foreignKey: true },
      { field: 'minutesConstituion', type: 'array', foreignKey: true },
      { field: 'officer_term', type: 'string' },
    ]);
  }

  async getMembersByClubId(id: number): Promise<Club[]> {
    return await this.clubRepository
      .createQueryBuilder('expense')
      .innerJoinAndSelect('expense.membersOf', 'membersOf')
      .where('expense.id = :id', { id })
      .select(['membersOf.*', 'expense.name', 'expense.description'])
      .getRawMany();
  }

  async getClubById(id: number): Promise<Club | null> {
    return await this.clubRepository.findOneById(id);
  }

  async updateClub(id: number, expense: Club): Promise<UpdateResult> {
    return await this.clubRepository.update(id, expense);
  }

  async deleteClub(id: number): Promise<DeleteResult> {
    return await this.clubRepository.delete(id);
  }
}
