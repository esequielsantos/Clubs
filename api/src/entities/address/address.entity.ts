import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { City } from './city.entity';
import { Members } from '../members/members.entity';
import { Club } from '../club/club.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column()
  postal_code: string;

  @Column({
    nullable: true,
  })
  observation: string;

  @Column({
    nullable: true,
  })
  reference: string;

  @Column()
  city_id: number;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Members, (member) => member.address)
  membersIn: Members[];

  @OneToOne(() => Club, (club) => club.address)
  club: Club;

  @OneToMany(() => Club, (club) => club.mailAddress)
  mailClub: Club;
}
