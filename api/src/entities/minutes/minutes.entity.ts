import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Members } from '../members/members.entity';
import { Meetings } from '../meetings/meetings.entity';
import { Club } from '../club/club.entity';

@Entity()
export class Minutes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  content: string;

  @ManyToMany(() => Meetings)
  meetings: Meetings[];

  @Column({
    default: null,
    nullable: true,
  })
  club_id: number;

  @ManyToOne(() => Club, (club) => club.minutesConstituion)
  @JoinColumn({ name: 'club_id' })
  minutesClub: Club;

  @Column()
  createdBy: number;

  @ManyToOne(() => Members, (member) => member.minutesCreated)
  @JoinColumn({ name: 'createdBy' })
  memberCreated: Members;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedBy: number;

  @ManyToOne(() => Members, (member) => member.minutesUpdated)
  @JoinColumn({ name: 'updatedBy' })
  memberUpdated: Members;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  final: boolean;

  @Column({ type: 'boolean', default: true, nullable: false })
  status: boolean;
}
