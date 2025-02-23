import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Incomes } from '../incomes/incomes.entity';
import { Members } from '../members/members.entity';
import { Expenses } from '../expenses/expenses.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: null,
    nullable: true,
  })
  incomes_id: number;

  @ManyToOne(() => Incomes, (income) => income.balance)
  @JoinColumn({ name: 'incomes_id' })
  income: Incomes;

  @Column({
    default: null,
    nullable: true,
  })
  expenses_id: number;

  @OneToMany(() => Expenses, (expense) => expense.balance)
  expense: Expenses[];

  @Column()
  balance_date: Date;

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
  balance: number;

  @Column({
    nullable: true,
  })
  member_id: number;

  @ManyToOne(() => Members, (member) => member.incomes)
  @JoinColumn({ name: 'member_id' })
  members: Members;
}
