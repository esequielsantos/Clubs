import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupRLS0000000000002 implements MigrationInterface {
  name = 'SetupRLS0000000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
          CREATE ROLE app_user NOLOGIN;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION current_club_id()
      RETURNS INTEGER AS $$
      BEGIN
        RETURN current_setting('app.current_club_id', true)::INTEGER;
      EXCEPTION WHEN OTHERS THEN
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);

    await queryRunner.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;`);
    await queryRunner.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_user;`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;`);

    const tenantTables = [
      { name: 'club', hasClubId: false },
      { name: 'profiles', hasClubId: true },
      { name: 'address', hasClubId: true },
      { name: 'members', hasClubId: true },
      { name: 'management', hasClubId: true },
      { name: 'monthly_fee', hasClubId: true },
      { name: 'incomes', hasClubId: true },
      { name: 'expenses', hasClubId: true },
      { name: 'balance', hasClubId: true },
      { name: 'meetings', hasClubId: true },
      { name: 'minutes', hasClubId: true },
      { name: 'meetings_members', hasClubId: true },
      { name: 'meetings_minutes', hasClubId: true },
    ];

    for (const table of tenantTables) {
      const colExpr = table.hasClubId ? 'club_id' : 'id';

      await queryRunner.query(`ALTER TABLE "${table.name}" ENABLE ROW LEVEL SECURITY;`);
      await queryRunner.query(`ALTER TABLE "${table.name}" FORCE ROW LEVEL SECURITY;`);

      await queryRunner.query(`DROP POLICY IF EXISTS "${table.name}_isolation_select" ON "${table.name}";`);
      await queryRunner.query(`
        CREATE POLICY "${table.name}_isolation_select" ON "${table.name}"
          FOR SELECT
          TO app_user
          USING (${colExpr} = current_club_id());
      `);

      await queryRunner.query(`DROP POLICY IF EXISTS "${table.name}_isolation_insert" ON "${table.name}";`);
      await queryRunner.query(`
        CREATE POLICY "${table.name}_isolation_insert" ON "${table.name}"
          FOR INSERT
          TO app_user
          WITH CHECK (${colExpr} = current_club_id());
      `);

      await queryRunner.query(`DROP POLICY IF EXISTS "${table.name}_isolation_update" ON "${table.name}";`);
      await queryRunner.query(`
        CREATE POLICY "${table.name}_isolation_update" ON "${table.name}"
          FOR UPDATE
          TO app_user
          USING (${colExpr} = current_club_id())
          WITH CHECK (${colExpr} = current_club_id());
      `);

      await queryRunner.query(`DROP POLICY IF EXISTS "${table.name}_isolation_delete" ON "${table.name}";`);
      await queryRunner.query(`
        CREATE POLICY "${table.name}_isolation_delete" ON "${table.name}"
          FOR DELETE
          TO app_user
          USING (${colExpr} = current_club_id());
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tenantTables = [
      'club', 'profiles', 'address', 'members', 'management',
      'monthly_fee', 'incomes', 'expenses', 'balance',
      'meetings', 'minutes', 'meetings_members', 'meetings_minutes',
    ];

    for (const name of tenantTables) {
      await queryRunner.query(`DROP POLICY IF EXISTS "${name}_isolation_select" ON "${name}";`);
      await queryRunner.query(`DROP POLICY IF EXISTS "${name}_isolation_insert" ON "${name}";`);
      await queryRunner.query(`DROP POLICY IF EXISTS "${name}_isolation_update" ON "${name}";`);
      await queryRunner.query(`DROP POLICY IF EXISTS "${name}_isolation_delete" ON "${name}";`);
      await queryRunner.query(`ALTER TABLE "${name}" NO FORCE ROW LEVEL SECURITY;`);
      await queryRunner.query(`ALTER TABLE "${name}" DISABLE ROW LEVEL SECURITY;`);
    }

    await queryRunner.query(`DROP FUNCTION IF EXISTS current_club_id();`);
  }
}
