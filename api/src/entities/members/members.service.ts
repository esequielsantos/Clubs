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
      throw new Error(`Membro com ID ${id} não encontrado.`);
    }
  }
}
