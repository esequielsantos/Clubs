import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Meetings } from './meetings.entity';
import { Members } from '../members/members.entity';

@Entity()
export class MeetingsMembers {
  @PrimaryColumn()
  meetings_id: number;

  @ManyToOne(() => Meetings)
  @JoinColumn({ name: 'meetings_id' })
  meeting: Meetings;

  @PrimaryColumn()
  members_id: number;

  @ManyToOne(() => Members)
  @JoinColumn({ name: 'members_id' })
  member: Members;
}
