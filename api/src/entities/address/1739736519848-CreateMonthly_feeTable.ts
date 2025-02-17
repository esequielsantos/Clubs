import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMonthlyFeeTable1739736519848 implements MigrationInterface {
  name = 'CreateMonthlyFeeTable1739736519848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_members" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "admit_date" datetime NOT NULL, "sponsor_id" integer NOT NULL, "birthday" datetime NOT NULL, "phone" varchar NOT NULL, "email" varchar NOT NULL, "rotary_id" integer NOT NULL, "profile_id" integer NOT NULL, "monthly_fee_division_id" integer NOT NULL, "honorary" boolean NOT NULL, "status" boolean NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "dtLastAccess" datetime NOT NULL, "fee_balance" decimal(10,2) DEFAULT (0.00), CONSTRAINT "FK_fcc994c1b73acbb700f9b7c5a21" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_members"("id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance") SELECT "id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance" FROM "members"`,
    );
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_members" RENAME TO "members"`,
    );
    await queryRunner.query(
      `CREATE TABLE "monthly_fee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "management_id" integer NOT NULL, "mounth" integer NOT NULL, "pay_date" datetime NOT NULL, "member_id" integer NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_members" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "admit_date" datetime NOT NULL, "sponsor_id" integer NOT NULL, "birthday" datetime NOT NULL, "phone" varchar NOT NULL, "email" varchar NOT NULL, "rotary_id" integer NOT NULL, "profile_id" integer NOT NULL, "monthly_fee_division_id" integer NOT NULL, "honorary" boolean NOT NULL, "status" boolean NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "dtLastAccess" datetime NOT NULL, "fee_balance" decimal(10,2) NOT NULL, CONSTRAINT "FK_fcc994c1b73acbb700f9b7c5a21" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_members"("id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance") SELECT "id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance" FROM "members"`,
    );
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_members" RENAME TO "members"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_monthly_fee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "management_id" integer NOT NULL, "mounth" integer NOT NULL, "pay_date" datetime NOT NULL, "member_id" integer NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_5665f94477587a6c3bee1480755" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_monthly_fee"("id", "name", "management_id", "mounth", "pay_date", "member_id", "createdBy", "createdAt", "updatedBy", "updatedAt") SELECT "id", "name", "management_id", "mounth", "pay_date", "member_id", "createdBy", "createdAt", "updatedBy", "updatedAt" FROM "monthly_fee"`,
    );
    await queryRunner.query(`DROP TABLE "monthly_fee"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_monthly_fee" RENAME TO "monthly_fee"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "monthly_fee" RENAME TO "temporary_monthly_fee"`,
    );
    await queryRunner.query(
      `CREATE TABLE "monthly_fee" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "management_id" integer NOT NULL, "mounth" integer NOT NULL, "pay_date" datetime NOT NULL, "member_id" integer NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "monthly_fee"("id", "name", "management_id", "mounth", "pay_date", "member_id", "createdBy", "createdAt", "updatedBy", "updatedAt") SELECT "id", "name", "management_id", "mounth", "pay_date", "member_id", "createdBy", "createdAt", "updatedBy", "updatedAt" FROM "temporary_monthly_fee"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_monthly_fee"`);
    await queryRunner.query(
      `ALTER TABLE "members" RENAME TO "temporary_members"`,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "admit_date" datetime NOT NULL, "sponsor_id" integer NOT NULL, "birthday" datetime NOT NULL, "phone" varchar NOT NULL, "email" varchar NOT NULL, "rotary_id" integer NOT NULL, "profile_id" integer NOT NULL, "monthly_fee_division_id" integer NOT NULL, "honorary" boolean NOT NULL, "status" boolean NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "dtLastAccess" datetime NOT NULL, "fee_balance" decimal(10,2) DEFAULT (0.00), CONSTRAINT "FK_fcc994c1b73acbb700f9b7c5a21" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "members"("id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance") SELECT "id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance" FROM "temporary_members"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_members"`);
    await queryRunner.query(`DROP TABLE "monthly_fee"`);
    await queryRunner.query(
      `ALTER TABLE "members" RENAME TO "temporary_members"`,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "admit_date" datetime NOT NULL, "sponsor_id" integer NOT NULL, "birthday" datetime NOT NULL, "phone" varchar NOT NULL, "email" varchar NOT NULL, "rotary_id" integer NOT NULL, "profile_id" integer NOT NULL, "monthly_fee_division_id" integer NOT NULL, "honorary" boolean NOT NULL, "status" boolean NOT NULL, "createdBy" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedBy" varchar NOT NULL, "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "dtLastAccess" datetime NOT NULL, "fee_balance" decimal(10,2) DEFAULT (0.00), CONSTRAINT "FK_fcc994c1b73acbb700f9b7c5a21" FOREIGN KEY ("profile_id") REFERENCES "profiles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "members"("id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance") SELECT "id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "monthly_fee_division_id", "honorary", "status", "createdBy", "createdAt", "updatedBy", "updatedAt", "dtLastAccess", "fee_balance" FROM "temporary_members"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_members"`);
  }
}
