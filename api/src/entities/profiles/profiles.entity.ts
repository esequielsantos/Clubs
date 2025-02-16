//profiles.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Management } from '../management/management.entity';

@Entity()
export class Profiles {
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

  @Column()
  profile: number;

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

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  dtLastAccess: Date;
}
