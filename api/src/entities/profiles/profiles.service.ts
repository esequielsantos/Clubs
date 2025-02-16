//profiles.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profiles } from './profiles.entity';
import { UpdateResult, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
  ) {}

  async createMember(member: Profiles): Promise<Profiles> {
    let has_sponsor: boolean = true; //check for null or invalid value
    let has_mfd: boolean = true;

    if (!member.sponsor_id) {
      has_sponsor = false;
    }

    if (!member.monthly_fee_division_id) {
      has_mfd = false;
    }

    if (has_sponsor && has_mfd) {
      return await this.profilesRepository.save(member); //all right, save and return... else
    } else {
      //crie uma variavel hoje com a data e hora atual
      const hoje = new Date();
      const newMember = new Profiles(); //create with 0... and
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
      const newMemberCreate = await this.profilesRepository.save(newMember);
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

  async getAllProfiles(): Promise<Profiles[]> {
    return await this.profilesRepository.find();
  }

  async getAllActiveProfiles(): Promise<Profiles[]> {
    return await this.profilesRepository.find({
      where: {
        status: true, // ou 'Status' se você tiver um campo chamado 'Status'
      },
    });
  }

  async getMemberById(id: number): Promise<Profiles | null> {
    return await this.profilesRepository.findOneById(id);
  }

  async updateMember(id: number, member: Profiles): Promise<UpdateResult> {
    if (member.sponsor_id === null || member.sponsor_id === 0) {
      member.sponsor_id = id;
    }
    if (
      member.monthly_fee_division_id === null ||
      member.monthly_fee_division_id === 0
    ) {
      member.monthly_fee_division_id = id;
    }
    return await this.profilesRepository.update(id, member);
  }

  async deleteMember(id: number): Promise<UpdateResult> {
    //return await this.profilesRepository.delete(id); //não apagar nenhum dado
    return await this.softDelete(id);
  }

  async softDelete(id: number): Promise<UpdateResult> {
    const member = await this.profilesRepository.findOneById(id);
    if (member) {
      member.status = false;
      return await this.profilesRepository.update(id, member);
    } else {
      throw new Error(`Membro com ID ${id} não encontrado.`);
    }
  }
}
