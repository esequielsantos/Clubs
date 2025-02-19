import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Members } from '../members/members.entity';
import { Incomes } from '../incomes/incomes.entity';

@Entity()
export class Monthly_fee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  management_id: number;

  @Column()
  pay_date: Date;

  @Column({
    default: 'By System',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.01,
    nullable: false,
  })
  value: number;

  @Column()
  member_id: number;

  @ManyToOne(() => Members, (member) => member.monthly_fee)
  @JoinColumn({ name: 'member_id' })
  members: Members;

  @OneToMany(() => Incomes, (income) => income.monthly_fees)
  incomes: Monthly_fee[];

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
