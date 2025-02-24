//members.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './members.entity';
import { UpdateResult, Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Members)
    private readonly membersRepository: Repository<Members>,
  ) {}

  async createMember(member: Members): Promise<Members> {
    let has_sponsor: boolean = true; //check for null or invalid value
    let has_mfd: boolean = true;

    if (!member.sponsor_id) {
      has_sponsor = false;
    }

    if (!member.monthly_fee_division_id) {
      has_mfd = false;
    }

    if (has_sponsor && has_mfd) {
      return await this.membersRepository.save(member); //all right, save and return... else
    } else {
      //crie uma variavel hoje com a data e hora atual
      const hoje = new Date();
      const newMember = new Members(); //create with 0... and
      newMember.name = member.name;
      newMember.admit_date = member.admit_date;
      newMember.sponsor_id = has_sponsor ? member.sponsor_id : 0;
      newMember.birthday = member.birthday;
      newMember.phone = member.phone;
      newMember.email = member.email;
      newMember.rotary_id = member.rotary_id;
      newMember.profile = member.profile;
      newMember.monthly_fee_division_id = has_mfd
        ? member.monthly_fee_division_id
        : 0;
      newMember.honorary = member.honorary;
      newMember.status = member.status;
      newMember.createdBy = member.createdBy ?? 'system';
      newMember.createdAt = hoje;
      newMember.updatedBy = member.updatedBy ?? 'system';
      newMember.updatedAt = hoje;
      newMember.dtLastAccess = hoje;
      const newMemberCreate = await this.membersRepository.save(newMember);
      const newId = newMemberCreate.id;
      if (!has_sponsor) {
        newMember.sponsor_id = newId;
      }
      if (!has_mfd) {
        newMember.monthly_fee_division_id = newId;
      }
      await this.updateMember(newId, newMember); //update with the ID
      return newMember;
    }
  }

  async getAllMembers(): Promise<Members[]> {
    return await this.membersRepository.find();
  }

  async getAllActiveMembers(): Promise<Members[]> {
    return await this.membersRepository.find({
      where: {
        status: true, // ou 'Status' se você tiver um campo chamado 'Status'
      },
    });
  }

  getMembersData(): Promise<
    { field: string; type: string; foreignKey?: boolean }[]
  > {
    return Promise.resolve([
      { field: 'id', type: 'number' },
      { field: 'name', type: 'string' },
      { field: 'admit_date', type: 'Date' },
      { field: 'sponsor_id', type: 'number', foreignKey: true },
      { field: 'birthday', type: 'Date' },
      { field: 'phone', type: 'string' },
      { field: 'email', type: 'string' },
      { field: 'rotary_id', type: 'string' },
      { field: 'profile', type: 'string', foreignKey: true },
      { field: 'monthly_fee_division_id', type: 'number', foreignKey: true },
      { field: 'honorary', type: 'boolean' },
      { field: 'status', type: 'boolean' },
      { field: 'createdBy', type: 'string' },
      { field: 'createdAt', type: 'Date' },
      { field: 'updatedBy', type: 'string' },
      { field: 'updatedAt', type: 'Date' },
      { field: 'dtLastAccess', type: 'Date' },
      { field: 'address', type: 'array', foreignKey: true },
      { field: 'monthly_fee', type: 'array', foreignKey: true },
      { field: 'presidentOf', type: 'array', foreignKey: true },
      { field: 'secretaryOf', type: 'array', foreignKey: true },
      { field: 'treasurerOf', type: 'array', foreignKey: true },
      { field: 'sponsor', type: 'array', foreignKey: true },
    ]);
  }

  async getMemberById(id: number): Promise<Members | null> {
    return await this.membersRepository.findOneById(id);
  }

  async getFullMemberById(id: number): Promise<Members | null> {
    return await this.membersRepository.findOne({
      where: { id },
      relations: [
        'address',
        'address.city',
        'address.city.state',
        'address.city.state.country',
        'profile',
        'club',
        'monthly_fee',
        'presidentOf',
        'secretaryOf',
        'treasurerOf',
        'sponsor',
      ],
    });
  }

  async updateMember(id: number, member: Members): Promise<UpdateResult> {
    if (member.sponsor_id === null || member.sponsor_id === 0) {
      member.sponsor_id = id;
    }
    if (
      member.monthly_fee_division_id === null ||
      member.monthly_fee_division_id === 0
    ) {
      member.monthly_fee_division_id = id;
    }
    return await this.membersRepository.update(id, member);
  }

  async deleteMember(id: number): Promise<UpdateResult> {
    //return await this.membersRepository.delete(id); //não apagar nenhum dado
    return await this.softDelete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    const member = await this.membersRepository.findOneById(id);
    if (member) {
      member.status = false;
      return await this.membersRepository.update(id, member);
    } else {
      throw new Error(`Member width ID ${id} not found.`);
    }
  }
}
