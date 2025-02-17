//members.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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

  @Column()
  birthday: Date;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  rotary_id: number;

  @Column({
    default: 9,
    nullable: true,
  })
  profile_id: number;

  @ManyToOne(() => Profiles, (profile) => profile.membersOf)
  @JoinColumn({ name: 'profile_id' })
  profile: Profiles;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee_balance: number;

  @Column()
  monthly_fee_division_id: number;

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
