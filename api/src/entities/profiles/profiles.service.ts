//profiles.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from './profiles.entity';
import { UpdateResult, Repository, DeleteResult } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
  ) {}

  async createProfile(profile: Profiles): Promise<Profiles> {
    return await this.profilesRepository.save(profile);
  }

  async getAllProfiles(): Promise<Profiles[]> {
    return await this.profilesRepository.find();
  }

  async getMembersByProfileId(id: number): Promise<Profiles[]> {
    return await this.profilesRepository
      .createQueryBuilder('profile')
      .innerJoinAndSelect('profile.membersOf', 'membersOf')
      .where('profile.id = :id', { id })
      .select(['membersOf.*', 'profile.name', 'profile.description'])
      .getRawMany();
  }

  async getProfileById(id: number): Promise<Profiles | null> {
    return await this.profilesRepository.findOneById(id);
  }

  async updateProfile(id: number, profile: Profiles): Promise<UpdateResult> {
    return await this.profilesRepository.update(id, profile);
  }

  async deleteProfile(id: number): Promise<DeleteResult> {
    return await this.profilesRepository.delete(id);
  }
}
