import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { State } from './state.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column({
    nullable: true,
  })
  observation: string;

  @Column()
  state_id: number;

  @ManyToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state: State;
}
