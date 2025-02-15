//management.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Management } from './management.entity';
import { UpdateResult, Repository } from 'typeorm';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Management)
    private readonly managementRepository: Repository<Management>,
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

  async getMembersPresident(): Promise<Management[] | null> {
    return await this.managementRepository.find({
      relations: ['presidentOf'],
    });
  }

  async getMembersSecretary(): Promise<Management[] | null> {
    return await this.managementRepository.find({
      relations: ['secretaryOf'],
    });
  }
  /* 
// Para obter o presidente de um gerenciamento específico:
const management = await managementRepository.findOne({ where: { id: 1 }, relations: ['president'] });
console.log(management.president.name); 

// Para obter todos os gerenciamentos em que um membro foi presidente:

console.log(member.presidentOf.map(m => m.first_year));


// Para incluir todas as relações de uma vez:
const managementWithAllMembers = await managementRepository.findOne({ 
    where: { id: 1 }, 
    relations: ['president', 'secretary', 'treasurer'] 
});

console.log(managementWithAllMembers.president.name);
console.log(managementWithAllMembers.secretary.name);
console.log(managementWithAllMembers.treasurer.name);
*/
}
