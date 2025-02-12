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

  @ManyToOne(() => Members, (member) => member.presidentOf)
  @JoinColumn({ name: 'president_id' }) // Nome da coluna na tabela Management
  president: Members;

  @ManyToOne(() => Members, (member) => member.secretaryOf)
  @JoinColumn({ name: 'secretary_id' })
  secretary: Members;

  @ManyToOne(() => Members, (member) => member.treasurerOf)
  @JoinColumn({ name: 'treasurer_id' })
  treasurer: Members;

  @Column()
  president_id: number;

  @Column()
  secretary_id: number;

  @Column()
  treasurer_id: number;

  @Column()
  first_year: number;

  @Column()
  history: string;
}
