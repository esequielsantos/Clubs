import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema0000000000001 implements MigrationInterface {
  name = 'CreateSchema0000000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "country" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR NOT NULL,
        "short_name" VARCHAR NOT NULL,
        "observation" VARCHAR,
        CONSTRAINT "PK_country" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "state" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR NOT NULL,
        "short_name" VARCHAR NOT NULL,
        "observation" VARCHAR,
        "country_id" INTEGER NOT NULL,
        CONSTRAINT "PK_state" PRIMARY KEY ("id"),
        CONSTRAINT "FK_state_country" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_state_country_id" ON "state" ("country_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "city" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR NOT NULL,
        "short_name" VARCHAR NOT NULL,
        "observation" VARCHAR,
        "state_id" INTEGER NOT NULL,
        CONSTRAINT "PK_city" PRIMARY KEY ("id"),
        CONSTRAINT "FK_city_state" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_city_state_id" ON "city" ("state_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "club" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR DEFAULT 'Rotary Club',
        "foundation_date" TIMESTAMP NOT NULL,
        "weekday_when" INTEGER NOT NULL,
        "hour_when" TIME NOT NULL,
        "description" VARCHAR,
        "language" VARCHAR DEFAULT 'Portugues do Brasil',
        "phone_number" VARCHAR NOT NULL,
        "id_rotary" INTEGER NOT NULL,
        "district" INTEGER NOT NULL,
        "zone" INTEGER NOT NULL,
        "address_id" INTEGER,
        "email" VARCHAR,
        "website" VARCHAR,
        "phone" VARCHAR,
        "mail_address_id" INTEGER,
        "sponsor_id" INTEGER DEFAULT 1,
        "balance" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        "per_capita" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        "magazine" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        "district_dues" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        CONSTRAINT "PK_club" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "address" (
        "id" SERIAL NOT NULL,
        "address1" VARCHAR NOT NULL,
        "address2" VARCHAR NOT NULL,
        "postal_code" VARCHAR NOT NULL,
        "observation" VARCHAR,
        "reference" VARCHAR,
        "city_id" INTEGER NOT NULL,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_address" PRIMARY KEY ("id"),
        CONSTRAINT "FK_address_city" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_address_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_address_club_id_id" ON "address" ("club_id", "id");
      CREATE INDEX "IDX_address_city_id" ON "address" ("city_id");
    `);

    await queryRunner.query(`
      ALTER TABLE "club" ADD CONSTRAINT "FK_club_address" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      ALTER TABLE "club" ADD CONSTRAINT "FK_club_mail_address" FOREIGN KEY ("mail_address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      CREATE INDEX "IDX_club_address_id" ON "club" ("address_id");
      CREATE INDEX "IDX_club_mail_address_id" ON "club" ("mail_address_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR NOT NULL,
        "description" VARCHAR NOT NULL,
        "canManageMembers" BOOLEAN NOT NULL,
        "canManageFinances" BOOLEAN NOT NULL,
        "canViewReports" BOOLEAN NOT NULL,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_profiles" PRIMARY KEY ("id"),
        CONSTRAINT "FK_profiles_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_profiles_club_id_id" ON "profiles" ("club_id", "id");
    `);

    await queryRunner.query(`
      CREATE TABLE "members" (
        "id" SERIAL NOT NULL,
        "name" VARCHAR NOT NULL,
        "admit_date" TIMESTAMP NOT NULL,
        "sponsor_id" INTEGER,
        "birthday" TIMESTAMP NOT NULL,
        "phone" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL,
        "rotary_id" INTEGER NOT NULL,
        "profile_id" INTEGER DEFAULT 9,
        "address_id" INTEGER DEFAULT 9,
        "fee_balance" NUMERIC(10,2) NOT NULL,
        "monthly_fee_division_id" INTEGER,
        "honorary" BOOLEAN NOT NULL,
        "status" BOOLEAN NOT NULL,
        "club_id" INTEGER NOT NULL,
        "createdBy" VARCHAR DEFAULT 'email@prov.com',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" VARCHAR DEFAULT 'email@prov.com',
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "dtLastAccess" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_members_sponsor" FOREIGN KEY ("sponsor_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_members_division" FOREIGN KEY ("monthly_fee_division_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_members_profile" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_members_address" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_members_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_members_club_id_id" ON "members" ("club_id", "id");
      CREATE INDEX "IDX_members_sponsor_id" ON "members" ("sponsor_id");
      CREATE INDEX "IDX_members_profile_id" ON "members" ("profile_id");
      CREATE INDEX "IDX_members_address_id" ON "members" ("address_id");
      CREATE INDEX "IDX_members_status" ON "members" ("club_id", "status");
    `);

    await queryRunner.query(`
      CREATE TABLE "management" (
        "id" SERIAL NOT NULL,
        "president_id" INTEGER NOT NULL,
        "secretary_id" INTEGER NOT NULL,
        "treasurer_id" INTEGER NOT NULL,
        "first_year" INTEGER NOT NULL,
        "history" VARCHAR NOT NULL,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_management" PRIMARY KEY ("id"),
        CONSTRAINT "FK_management_president" FOREIGN KEY ("president_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_management_secretary" FOREIGN KEY ("secretary_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_management_treasurer" FOREIGN KEY ("treasurer_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_management_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_management_club_id_id" ON "management" ("club_id", "id");
      CREATE INDEX "IDX_management_president_id" ON "management" ("president_id");
      CREATE INDEX "IDX_management_secretary_id" ON "management" ("secretary_id");
      CREATE INDEX "IDX_management_treasurer_id" ON "management" ("treasurer_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "monthly_fee" (
        "id" SERIAL NOT NULL,
        "management_id" INTEGER NOT NULL,
        "pay_date" TIMESTAMP NOT NULL,
        "description" VARCHAR DEFAULT 'By System',
        "value" NUMERIC(10,2) NOT NULL DEFAULT 0.01,
        "member_id" INTEGER NOT NULL,
        "club_id" INTEGER NOT NULL,
        "createdBy" VARCHAR DEFAULT 'email@prov.com',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" VARCHAR DEFAULT 'email@prov.com',
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_monthly_fee" PRIMARY KEY ("id"),
        CONSTRAINT "FK_monthly_fee_member" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_monthly_fee_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_monthly_fee_club_id_id" ON "monthly_fee" ("club_id", "id");
      CREATE INDEX "IDX_monthly_fee_member_id" ON "monthly_fee" ("member_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "incomes" (
        "id" SERIAL NOT NULL,
        "monthly_fee_id" INTEGER,
        "income_date" TIMESTAMP NOT NULL,
        "description" VARCHAR DEFAULT 'Read automatically',
        "value" NUMERIC(10,2) NOT NULL DEFAULT 0.01,
        "income_balance" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        "member_id" INTEGER,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_incomes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_incomes_monthly_fee" FOREIGN KEY ("monthly_fee_id") REFERENCES "monthly_fee"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_incomes_member" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_incomes_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_incomes_club_id_id" ON "incomes" ("club_id", "id");
      CREATE INDEX "IDX_incomes_monthly_fee_id" ON "incomes" ("monthly_fee_id");
      CREATE INDEX "IDX_incomes_member_id" ON "incomes" ("member_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "expenses" (
        "id" SERIAL NOT NULL,
        "expense_date" TIMESTAMP NOT NULL,
        "description" VARCHAR DEFAULT 'Read automatically',
        "value" NUMERIC(10,2) NOT NULL DEFAULT 0.01,
        "expense_balance" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        "member_id" INTEGER,
        "perCapita_id" INTEGER,
        "magazine_id" INTEGER,
        "district_due_id" INTEGER,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_expenses" PRIMARY KEY ("id"),
        CONSTRAINT "FK_expenses_member" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_expenses_perCapita" FOREIGN KEY ("perCapita_id") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_expenses_magazine" FOREIGN KEY ("magazine_id") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_expenses_district_due" FOREIGN KEY ("district_due_id") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_expenses_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_expenses_club_id_id" ON "expenses" ("club_id", "id");
      CREATE INDEX "IDX_expenses_member_id" ON "expenses" ("member_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "balance" (
        "id" SERIAL NOT NULL,
        "incomes_id" INTEGER,
        "expenses_id" INTEGER,
        "balance_date" TIMESTAMP NOT NULL,
        "description" VARCHAR DEFAULT 'Read automatically',
        "value" NUMERIC(10,2) NOT NULL DEFAULT 0.01,
        "balance" NUMERIC(10,2) NOT NULL DEFAULT 1.01,
        "member_id" INTEGER,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_balance" PRIMARY KEY ("id"),
        CONSTRAINT "FK_balance_incomes" FOREIGN KEY ("incomes_id") REFERENCES "incomes"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_balance_expenses" FOREIGN KEY ("expenses_id") REFERENCES "expenses"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_balance_member" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_balance_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_balance_club_id_id" ON "balance" ("club_id", "id");
      CREATE INDEX "IDX_balance_incomes_id" ON "balance" ("incomes_id");
      CREATE INDEX "IDX_balance_member_id" ON "balance" ("member_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "meetings" (
        "id" SERIAL NOT NULL,
        "local_name" VARCHAR DEFAULT 'Sede do Rotary Club',
        "meeting_date" TIMESTAMP NOT NULL,
        "hour_when_start" TIME NOT NULL,
        "hour_when_finish" TIME NOT NULL,
        "minutes_id" INTEGER,
        "club_id" INTEGER NOT NULL,
        "address_id" INTEGER NOT NULL,
        CONSTRAINT "PK_meetings" PRIMARY KEY ("id"),
        CONSTRAINT "FK_meetings_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_meetings_address" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_meetings_club_id_id" ON "meetings" ("club_id", "id");
      CREATE INDEX "IDX_meetings_address_id" ON "meetings" ("address_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "minutes" (
        "id" SERIAL NOT NULL,
        "content" TEXT NOT NULL,
        "club_id" INTEGER,
        "createdBy" INTEGER NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedBy" INTEGER NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "final" BOOLEAN NOT NULL DEFAULT false,
        "status" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_minutes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_minutes_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT "FK_minutes_createdBy" FOREIGN KEY ("createdBy") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "FK_minutes_updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_minutes_club_id_id" ON "minutes" ("club_id", "id");
      CREATE INDEX "IDX_minutes_createdBy" ON "minutes" ("createdBy");
      CREATE INDEX "IDX_minutes_updatedBy" ON "minutes" ("updatedBy");
    `);

    await queryRunner.query(`
      CREATE TABLE "meetings_members" (
        "meetings_id" INTEGER NOT NULL,
        "members_id" INTEGER NOT NULL,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_meetings_members" PRIMARY KEY ("meetings_id", "members_id"),
        CONSTRAINT "FK_meetings_members_meeting" FOREIGN KEY ("meetings_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_meetings_members_member" FOREIGN KEY ("members_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_meetings_members_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_meetings_members_club_id" ON "meetings_members" ("club_id", "meetings_id", "members_id");
    `);

    await queryRunner.query(`
      CREATE TABLE "meetings_minutes" (
        "meetings_id" INTEGER NOT NULL,
        "minutes_id" INTEGER NOT NULL,
        "club_id" INTEGER NOT NULL,
        CONSTRAINT "PK_meetings_minutes" PRIMARY KEY ("meetings_id", "minutes_id"),
        CONSTRAINT "FK_meetings_minutes_meeting" FOREIGN KEY ("meetings_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_meetings_minutes_minute" FOREIGN KEY ("minutes_id") REFERENCES "minutes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_meetings_minutes_club" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE INDEX "IDX_meetings_minutes_club_id" ON "meetings_minutes" ("club_id", "meetings_id", "minutes_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "meetings_minutes" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "meetings_members" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "minutes" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "meetings" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "balance" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "expenses" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "incomes" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "monthly_fee" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "management" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "members" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "address" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "profiles" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "club" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "city" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "state" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "country" CASCADE;`);
  }
}
