//members.service
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './members.entity';
import { UpdateResult, Repository, DataSource } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Members)
    private readonly membersRepository: Repository<Members>,
    private dataSource: DataSource,
  ) {}

  async createMember(member: Members): Promise<Members> {
    return await this.membersRepository.save(member);
  }

  async getAllMembers(): Promise<Members[]> {
    return await this.membersRepository.find();
  }

  async recoverEmail(docId: string, birthDate: Date): Promise<Members | null> {
    const member = await this.membersRepository.findOne({
      where: {
        doc_id: docId,
        birthdate: birthDate,
      },
    });
    if (member) {
      return member;
    }
    return null;
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

  getMembersData2(): { field: string; type: string; foreignKey?: boolean }[] {
    const metadata = this.dataSource.getMetadata(Members);
    return metadata.columns.map((column) => ({
      field: column.propertyName,
      type: column.type as string,
      foreignKey: column.relationMetadata ? true : false,
    }));
  }

  async getMemberById(id: number): Promise<Members | null> {
    return await this.membersRepository.findOneBy({ id });
  }

  async getMemberByEmail(email: string): Promise<Members | null> {
    return await this.membersRepository.findOneBy({ email: email });
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

  async updatedMember(member: Members): Promise<UpdateResult> {
    return await this.membersRepository.update(member.id, member);
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
