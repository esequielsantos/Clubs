//management.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Members } from '../members/members.entity';

@Entity()
export class Management {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  president_id: number;

  @ManyToOne(() => Members, (member) => member.presidentOf)
  @JoinColumn({ name: 'president_id' })
  president: Members;

  @Column()
  secretary_id: number;

  @ManyToOne(() => Members, (member) => member.secretaryOf)
  @JoinColumn({ name: 'secretary_id' })
  secretary: Members;

  @Column()
  treasurer_id: number;

  @ManyToOne(() => Members, (member) => member.treasurerOf)
  @JoinColumn({ name: 'treasurer_id' })
  treasurer: Members;

  @Column()
  first_year: number;

  @Column()
  history: string;
}
