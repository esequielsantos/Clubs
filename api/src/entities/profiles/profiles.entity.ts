import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Members } from '../members/members.entity';

@Entity()
export class Profiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  canManageMembers: boolean;

  @Column()
  canManageFinances: boolean;

  @Column()
  canViewReports: boolean;

  @OneToMany(() => Members, (member) => member.profile)
  membersOf: Members[];
}
