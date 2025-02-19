import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Monthly_fee } from '../monthly_fee/monthly_fee.entity';
import { Members } from '../members/members.entity';
import { Balance } from '../balance/balance.entity';

@Entity()
export class Incomes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
    nullable: true,
  })
  monthly_fee_id: number;

  @ManyToOne(() => Monthly_fee, (monthly_fee) => monthly_fee.incomes)
  @JoinColumn({ name: 'monthly_fee_id' })
  monthly_fees: Monthly_fee;

  @Column()
  income_date: Date;

  @Column({
    default: 'Read automatically',
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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 1.01,
    nullable: false,
  })
  income_balance: number;

  @Column({
    nullable: true,
  })
  member_id: number;

  @ManyToOne(() => Members, (member) => member.incomes)
  @JoinColumn({ name: 'member_id' })
  members: Members;

  @OneToMany(() => Balance, (balance) => balance.income)
  balance: Balance[];
}
