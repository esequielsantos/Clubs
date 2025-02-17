import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Members } from '../members/members.entity';

@Entity()
export class Monthly_fee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  management_id: number;

  @Column()
  pay_date: Date;

  @Column()
  member_id: number;

  @Column({
    default: 'By System',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => Members, (member) => member.monthly_fee)
  @JoinColumn({ name: 'member_id' })
  members: Members;

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
}
