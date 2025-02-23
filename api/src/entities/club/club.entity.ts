import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Address } from '../address/address.entity';
import { Members } from '../members/members.entity';
import { Meetings } from '../meetings/meetings.entity';
import { Minutes } from '../minutes/minutes.entity';
import { Expenses } from '../expenses/expenses.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 'Rotary Club',
    nullable: true,
  })
  name: string;

  @Column()
  foundation_date: Date;

  @Column()
  weekday_when: number;

  @Column({ type: 'time' })
  hour_when: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    default: 'Portugues do Brasil',
    nullable: true,
  })
  language: string;

  @Column()
  phone_number: string;

  @Column()
  id_rotary: number;

  @Column()
  district: number;

  @Column()
  zone: number;

  @Column({
    nullable: true,
  })
  address_id: number;

  @OneToOne(() => Address, (address) => address.club)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  website: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  mail_address_id: number;

  @ManyToOne(() => Address, (address) => address.club)
  @JoinColumn({ name: 'mail_address_id' })
  mailAddress: Address;

  @OneToMany(() => Meetings, (meeting) => meeting.club)
  @JoinColumn({ name: 'club_id' })
  clubMeeting: Address[];

  @Column({
    default: 1,
    nullable: true,
  })
  sponsor_id: number;

  @OneToMany(() => Members, (member) => member.club)
  members: Members[];

  @OneToMany(() => Minutes, (minute) => minute.minutesClub)
  minutesConstituion: Minutes[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 1.01,
    nullable: false,
  })
  balance: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 1.01,
    nullable: false,
  })
  per_capita: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 1.01,
    nullable: false,
  })
  magazine: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 1.01,
    nullable: false,
  })
  district_dues: number;

  @OneToMany(() => Expenses, (expense) => expense.perCapita)
  expensesPercapita: Expenses[];

  @OneToMany(() => Expenses, (expense) => expense.magazine)
  expensesMagazine: Expenses[];

  @OneToMany(() => Expenses, (expense) => expense.districtDue)
  expensesDistrictDue: Expenses[];
}
