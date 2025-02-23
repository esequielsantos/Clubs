//meetings.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meetings } from './meetings.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meetings)
    private readonly meetingsRepository: Repository<Meetings>,
  ) {}

  async createMeetings(expense: Meetings): Promise<Meetings> {
    return await this.meetingsRepository.save(expense);
  }

  async getAllMeetings(): Promise<Meetings[]> {
    return await this.meetingsRepository.find();
  }

  async getMembersByMeetingsId(id: number): Promise<any[]> {
    return await this.meetingsRepository
      .createQueryBuilder('meetings')
      .innerJoinAndSelect('meetings.members', 'members')
      .where('meetings.id = :id', { id })
      .select(['members.*', 'meetings.local_name', 'meetings.meeting_date'])
      .getRawMany();
  }

  async getMeetingsById(id: number): Promise<Meetings | null> {
    return await this.meetingsRepository.findOneById(id);
  }

  async updateMeetings(id: number, expense: Meetings): Promise<UpdateResult> {
    return await this.meetingsRepository.update(id, expense);
  }

  async deleteMeetings(id: number): Promise<DeleteResult> {
    return await this.meetingsRepository.delete(id);
  }
}
