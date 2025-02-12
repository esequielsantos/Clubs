// migration.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Migration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  tableName: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}