// members.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.MEMBERS (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        admit_date TIMESTAMP,
        sponsor_id INTEGER REFERENCES members(id),
        birthday TIMESTAMP,
        phone VARCHAR(20),
        email VARCHAR(255) UNIQUE,
        rotary_id INTEGER,
        profile INTEGER,
        monthly_fee_division_id INTEGER REFERENCES members(id),
        honorary BOOLEAN
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE public.MEMBERS;
    `);
  }
}