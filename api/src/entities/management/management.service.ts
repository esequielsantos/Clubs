//management.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Management } from './management.entity';
import { Members } from '../members/members.entity';
import { UpdateResult, Repository } from 'typeorm';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Management)
    private readonly managementRepository: Repository<Management>,
    @InjectRepository(Members)
    private readonly membersRepository: Repository<Members>,
  ) {}

  async createManagement(management: Management): Promise<Management> {
    return await this.managementRepository.save(management);
  }

  async getAllManagement(): Promise<Management[]> {
    return await this.managementRepository.find();
  }

  async getAllActiveManagement(): Promise<Management[]> {
    const currentMonth = new Date().getMonth();
    const currentYear =
      currentMonth > 6
        ? new Date().getFullYear()
        : new Date().getFullYear() - 1;

    return await this.managementRepository.find({
      where: {
        first_year: currentYear, // so traz Management do ano atual
      },
    });
  }

  async getManagementById(id: number): Promise<Management | null> {
    return await this.managementRepository.findOneById(id);
  }

  async updateManagement(
    id: number,
    management: Management,
  ): Promise<UpdateResult> {
    return await this.managementRepository.update(id, management);
  }

  async getPresidentById(id: number): Promise<Management | null> {
    return await this.managementRepository.findOne({
      where: { id: id },
      relations: ['president'],
    });
  }

  async getMembersPresident(): Promise<any> {
    return this.managementRepository
      .createQueryBuilder('management')
      .innerJoinAndSelect('management.president', 'president')
      .select(['president.*', 'management.first_year'])
      .getRawMany();
  }

  async getMembersPresidentInYear(year: number): Promise<any> {
    return this.managementRepository
      .createQueryBuilder('management')
      .innerJoinAndSelect('management.president', 'president')
      .where('management.first_year = :year', { year })
      .select(['president.*', 'management.first_year'])
      .getRawMany();
  }

  async getMembersSecretary(): Promise<Members[] | null> {
    const secretaries = await this.managementRepository
      .createQueryBuilder('management')
      .innerJoinAndSelect('management.secretary', 'secretary')
      .getMany();

    return secretaries.map((management) => management.secretary);
  }

  async getMembersSecretaryInYear(year: number): Promise<any> {
    return this.managementRepository
      .createQueryBuilder('management')
      .innerJoinAndSelect('management.secretary', 'secretary')
      .where('management.first_year = :year', { year })
      .select(['secretary.*', 'management.first_year'])
      .getRawMany();
  }

  async getMembersTreasurer(): Promise<any> {
    return this.managementRepository
      .createQueryBuilder('management')
      .innerJoinAndSelect('management.treasurer', 'treasurer')
      .select(['treasurer.*', 'management.first_year'])
      .getRawMany();
  }

  async getMembersTreasurerInYear(year: number): Promise<any> {
    return this.managementRepository
      .createQueryBuilder('management')
      .innerJoinAndSelect('management.treasurer', 'treasurer')
      .where('management.first_year = :year', { year })
      .select(['treasurer.*', 'management.first_year'])
      .getRawMany();
  }

}
