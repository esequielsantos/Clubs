import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Members } from '../members/members.entity';
import { Balance } from '../balance/balance.entity';
import { Club } from '../club/club.entity';

@Entity()
export class Expenses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  expense_date: Date;

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
  expense_balance: number;

  @Column({
    nullable: true,
  })
  member_id: number;

  @ManyToOne(() => Members, (member) => member.expenses)
  @JoinColumn({ name: 'member_id' })
  members: Members;

  @OneToMany(() => Balance, (balance) => balance.expense)
  balance: Balance[];

  @Column({
    nullable: true,
  })
  perCapita_id: number;

  @ManyToOne(() => Club, (club) => club.expensesPercapita)
  @JoinColumn({ name: 'perCapita_id' })
  perCapita: Club;

  @Column({
    nullable: true,
  })
  magazine_id: number;

  @ManyToOne(() => Club, (club) => club.expensesMagazine)
  @JoinColumn({ name: 'magazine_id' })
  magazine: Club;

  @Column({
    nullable: true,
  })
  district_due_id: number;

  @ManyToOne(() => Club, (club) => club.expensesDistrictDue)
  @JoinColumn({ name: 'district_due_id' })
  districtDue: Club;
}
