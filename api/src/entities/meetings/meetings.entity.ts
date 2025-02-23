import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Address } from '../address/address.entity';
import { Club } from '../club/club.entity';
import { Members } from '../members/members.entity';

@Entity()
export class Meetings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 'Sede do Rotary Club',
    nullable: true,
  })
  local_name: string;

  @Column()
  meeting_date: Date;

  @Column({ type: 'time' })
  hour_when_start: string;

  @Column({ type: 'time' })
  hour_when_finish: string;

  @Column({
    nullable: true,
  })
  minutes_id: number;

  @Column({
    nullable: true,
  })
  club_id: number;

  @ManyToOne(() => Club, (club) => club.clubMeeting)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @Column()
  address_id: number;

  @ManyToOne(() => Address, (address) => address.meetingAddress)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @ManyToMany(() => Members)
  @JoinTable({
    name: 'meetings_members',
    joinColumn: { name: 'meetings_id' },
    inverseJoinColumn: { name: 'members_id' },
  })
  members: Members[];
}
