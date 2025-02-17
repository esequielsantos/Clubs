//members.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Management } from '../management/management.entity';
import { Profiles } from '../profiles/profiles.entity';
import { Monthly_fee } from '../monthly_fee/monthly_fee.entity';

@Entity()
export class Members {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  admit_date: Date;

  @Column()
  sponsor_id: number;

  @ManyToOne(() => Members, (member) => member.sponsoredMembers)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: Members;

  @OneToMany(() => Members, (member) => member.sponsor)
  sponsoredMembers: Members[];

  @Column()
  birthday: Date;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  rotary_id: number;

  @Column()
  profile_id: number;

  @ManyToOne(() => Profiles, (profile) => profile.membersOf)
  @JoinColumn({ name: 'profile_id' })
  profile: Profiles;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee_balance: number;

  @Column()
  monthly_fee_division_id: number;

  @ManyToOne(() => Members, (member) => member.divisionMembers)
  @JoinColumn({ name: 'sponsor_id' })
  division: Members;

  @OneToMany(() => Members, (member) => member.division)
  divisionMembers: Members[];

  @Column()
  honorary: boolean;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;

  @OneToMany(() => Management, (management) => management.president)
  presidentOf: Management[];

  @OneToMany(() => Management, (management) => management.secretary)
  secretaryOf: Management[];

  @OneToMany(() => Management, (management) => management.treasurer)
  treasurerOf: Management[];

  @OneToMany(() => Monthly_fee, (monthly_fee) => monthly_fee.members)
  monthly_fee: Monthly_fee[];

  @OneToMany(() => Incomes, (income) => income.members)
  incomes: Incomes[];

  @OneToMany(() => Expenses, (expense) => expense.members)
  expenses: Expenses[];

  @OneToMany(() => Minutes, (minute) => minute.memberCreated)
  minutesCreated: Minutes[];

  @OneToMany(() => Minutes, (minute) => minute.memberUpdated)
  minutesUpdated: Minutes[];

  @ManyToMany(() => Meetings)
  meetings: Meetings[];

  @Column({
    nullable: true,
  })
  club_id: number;

  @ManyToOne(() => Club, (club) => club.members)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column({
    default: 'email@prov.com',
    nullable: true,
  })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    default: 'email@prov.com',
    nullable: true,
  })
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @UpdateDateColumn()
  dtLastAccess: Date;
}
