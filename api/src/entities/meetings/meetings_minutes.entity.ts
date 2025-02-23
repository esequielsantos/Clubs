import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Meetings } from './meetings.entity';
import { Minutes } from '../minutes/minutes.entity';

@Entity()
export class MeetingsMembers {
  @PrimaryColumn()
  meetings_id: number;

  @ManyToOne(() => Meetings)
  @JoinColumn({ name: 'meetings_id' })
  meeting: Meetings;

  @PrimaryColumn()
  members_id: number;

  @ManyToOne(() => Minutes)
  @JoinColumn({ name: 'members_id' })
  member: Minutes;
}
