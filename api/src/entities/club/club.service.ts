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
