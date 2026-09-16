import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData0000000000003 implements MigrationInterface {
  name = 'SeedInitialData0000000000003';

  private async seed(
    table: string,
    idCol: string,
    columns: string,
    values: string,
    maxId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "${table}" (${columns}) VALUES ${values}
      ON CONFLICT ("${idCol}") DO NOTHING;
    `);
    try {
      await queryRunner.query(`
        SELECT setval(
          pg_get_serial_sequence('"${table}"', '${idCol}'),
          GREATEST(COALESCE((SELECT MAX("${idCol}") FROM "${table}"), 0), ${maxId})
        );
      `);
    } catch (_err) {
      // noop
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.seed(
      'country',
      'id',
      '"id", "name", "short_name", "observation"',
      `(1, 'Brasil', 'BR', NULL),
        (2, 'Estados Unidos', 'US', NULL),
        (3, 'Argentina', 'AR', NULL)`,
      3,
      queryRunner,
    );

    await this.seed(
      'state',
      'id',
      '"id", "name", "short_name", "observation", "country_id"',
      `(1, 'São Paulo', 'SP', NULL, 1),
        (2, 'Rio de Janeiro', 'RJ', NULL, 1),
        (3, 'Minas Gerais', 'MG', NULL, 1),
        (4, 'Rio Grande do Sul', 'RS', NULL, 1),
        (5, 'Paraná', 'PR', NULL, 1),
        (6, 'Santa Catarina', 'SC', NULL, 1),
        (7, 'Bahia', 'BA', NULL, 1),
        (8, 'Distrito Federal', 'DF', NULL, 1)`,
      8,
      queryRunner,
    );

    await this.seed(
      'city',
      'id',
      '"id", "name", "short_name", "observation", "state_id"',
      `(1, 'São Paulo', 'SP', NULL, 1),
        (2, 'Campinas', 'Camp', NULL, 1),
        (3, 'Rio de Janeiro', 'RJ', NULL, 2),
        (4, 'Belo Horizonte', 'BH', NULL, 3),
        (5, 'Porto Alegre', 'POA', NULL, 4),
        (6, 'Curitiba', 'CWB', NULL, 5),
        (7, 'Florianópolis', 'FLN', NULL, 6),
        (8, 'Salvador', 'SSA', NULL, 7),
        (9, 'Brasília', 'BSB', NULL, 8)`,
      9,
      queryRunner,
    );

    await this.seed(
      'club',
      'id',
      '"id", "name", "foundation_date", "weekday_when", "hour_when", "description", "language", "phone_number", "id_rotary", "district", "zone", "address_id", "email", "website", "phone", "mail_address_id", "sponsor_id", "balance", "per_capita", "magazine", "district_dues"',
      `(1, 'Rotary Club São Paulo Centro', '1945-07-12 00:00:00', 4, '19:30:00', 'Clube fundado em 1945, foco em projetos comunitários.', 'Portugues do Brasil', '(11) 3000-0001', 1001, 4420, 1, NULL, 'contato@rcspcentro.org.br', 'https://rcspcentro.org.br', '(11) 99000-0001', NULL, 0, 50000.00, 120.50, 36.00, 48.00),
        (2, 'Rotary Club Rio de Janeiro Copacabana', '1952-03-08 00:00:00', 2, '20:00:00', 'Clube histórico da zona sul carioca.', 'Portugues do Brasil', '(21) 2500-0002', 1002, 4450, 1, NULL, 'contato@rccopacabana.org.br', 'https://rccopacabana.org.br', '(21) 98000-0002', NULL, 0, 42000.00, 120.50, 36.00, 48.00)`,
      2,
      queryRunner,
    );

    await this.seed(
      'address',
      'id',
      '"id", "address1", "address2", "postal_code", "observation", "reference", "city_id", "club_id"',
      `(1, 'Av. Paulista, 1000', 'Sala 501', '01310-100', 'Próximo ao metrô Consolação', 'Edifício Torre Paulista', 1, 1),
        (2, 'Rua Barata Ribeiro, 200', 'Cobertura 2', '22040-001', NULL, 'Esquina com Rua Anita Garibaldi', 3, 2)`,
      2,
      queryRunner,
    );

    await queryRunner.query(`UPDATE "club" SET "address_id" = 1 WHERE "id" = 1;`);
    await queryRunner.query(`UPDATE "club" SET "address_id" = 2 WHERE "id" = 2;`);

    await this.seed(
      'profiles',
      'id',
      '"id", "name", "description", "canManageMembers", "canManageFinances", "canViewReports", "club_id"',
      `(1, 'Presidente', 'Acesso total ao clube', true, true, true, 1),
        (2, 'Secretário', 'Gerencia membros e comunicação', true, false, true, 1),
        (3, 'Tesoureiro', 'Gerencia finanças', false, true, true, 1),
        (4, 'Membro', 'Acesso básico a relatórios públicos', false, false, true, 1),
        (5, 'Presidente', 'Acesso total ao clube', true, true, true, 2),
        (6, 'Secretário', 'Gerencia membros e comunicação', true, false, true, 2),
        (7, 'Tesoureiro', 'Gerencia finanças', false, true, true, 2),
        (8, 'Membro', 'Acesso básico a relatórios públicos', false, false, true, 2)`,
      8,
      queryRunner,
    );

    await this.seed(
      'members',
      'id',
      '"id", "name", "admit_date", "sponsor_id", "birthday", "phone", "email", "rotary_id", "profile_id", "address_id", "fee_balance", "monthly_fee_division_id", "honorary", "status", "club_id", "createdBy", "updatedBy"',
      `(1, 'João Silva Pereira', '2018-03-15 00:00:00', NULL, '1975-05-20 00:00:00', '(11) 99100-0001', 'joao.pereira@email.com', 100101, 1, 1, 0.00, NULL, false, true, 1, 'system', 'system'),
        (2, 'Maria Oliveira Souza', '2020-07-10 00:00:00', 1, '1982-11-03 00:00:00', '(11) 99100-0002', 'maria.souza@email.com', 100102, 2, 1, 240.00, 1, false, true, 1, 'system', 'system'),
        (3, 'Carlos Alberto Mendes', '2019-01-22 00:00:00', 1, '1968-09-15 00:00:00', '(11) 99100-0003', 'carlos.mendes@email.com', 100103, 3, 1, 0.00, 1, false, true, 1, 'system', 'system'),
        (4, 'Ana Beatriz Costa', '2022-02-05 00:00:00', 2, '1990-04-28 00:00:00', '(21) 98200-0004', 'ana.costa@email.com', 100201, 5, 2, 120.00, NULL, false, true, 2, 'system', 'system'),
        (5, 'Roberto Fonseca Lima', '2017-09-18 00:00:00', NULL, '1972-12-10 00:00:00', '(21) 98200-0005', 'roberto.lima@email.com', 100202, 6, 2, 0.00, 4, false, true, 2, 'system', 'system')`,
      5,
      queryRunner,
    );

    await this.seed(
      'management',
      'id',
      '"id", "president_id", "secretary_id", "treasurer_id", "first_year", "history", "club_id"',
      `(1, 1, 2, 3, 2025, 'Gestão 2025-2026: Projetos de alfabetização e assistência social.', 1),
        (2, 4, 5, 4, 2025, 'Gestão 2025-2026: Revitalização do clube e novos membros.', 2)`,
      2,
      queryRunner,
    );

    await this.seed(
      'monthly_fee',
      'id',
      '"id", "management_id", "pay_date", "description", "value", "member_id", "club_id", "createdBy", "updatedBy"',
      `(1, 1, '2026-01-10 00:00:00', 'Mensalidade Janeiro/2026', 180.00, 1, 1, 'system', 'system'),
        (2, 1, '2026-01-15 00:00:00', 'Mensalidade Janeiro/2026', 180.00, 3, 1, 'system', 'system'),
        (3, 2, '2026-01-08 00:00:00', 'Mensalidade Janeiro/2026', 180.00, 4, 2, 'system', 'system')`,
      3,
      queryRunner,
    );

    await this.seed(
      'meetings',
      'id',
      '"id", "local_name", "meeting_date", "hour_when_start", "hour_when_finish", "minutes_id", "club_id", "address_id"',
      `(1, 'Sede do Rotary Club SP Centro', '2026-01-08 19:30:00', '19:30:00', '21:00:00', NULL, 1, 1),
        (2, 'Sede do Rotary Club SP Centro', '2026-01-15 19:30:00', '19:30:00', '21:00:00', NULL, 1, 1),
        (3, 'Sede do RC Copacabana', '2026-01-06 20:00:00', '20:00:00', '21:30:00', NULL, 2, 2)`,
      3,
      queryRunner,
    );

    await this.seed(
      'minutes',
      'id',
      '"id", "content", "club_id", "createdBy", "updatedBy", "final", "status"',
      `(1, 'Ata da reunião ordinária de 08/01/2026. Comparecimento: 3 membros. Discussão sobre projeto de alfabetização em escolas locais. Próximos passos: definir voluntários e data de início.', 1, 1, 1, true, true),
        (2, 'Ata da reunião de 06/01/2026. Aprovação do orçamento semestral. Campanha de novos membros agendada para fevereiro.', 2, 4, 4, false, true)`,
      2,
      queryRunner,
    );

    await this.seed(
      'incomes',
      'id',
      '"id", "monthly_fee_id", "income_date", "description", "value", "income_balance", "member_id", "club_id"',
      `(1, 1, '2026-01-10 00:00:00', 'Pagamento mensalidade João Pereira', 180.00, 180.00, 1, 1),
        (2, 2, '2026-01-15 00:00:00', 'Pagamento mensalidade Carlos Mendes', 180.00, 180.00, 3, 1),
        (3, 3, '2026-01-08 00:00:00', 'Pagamento mensalidade Ana Costa', 180.00, 180.00, 4, 2),
        (4, NULL, '2026-01-12 00:00:00', 'Doação empresarial - Projeto Alfabetização', 5000.00, 5000.00, NULL, 1)`,
      4,
      queryRunner,
    );

    await this.seed(
      'expenses',
      'id',
      '"id", "expense_date", "description", "value", "expense_balance", "member_id", "perCapita_id", "magazine_id", "district_due_id", "club_id"',
      `(1, '2026-01-05 00:00:00', 'Material para projeto alfabetização', 1200.00, 1200.00, NULL, NULL, NULL, NULL, 1),
        (2, '2026-01-20 00:00:00', 'Per Capita RI - janeiro', 300.00, 300.00, NULL, 1, NULL, NULL, 1),
        (3, '2026-01-20 00:00:00', 'Taxa de revista - janeiro', 96.00, 96.00, NULL, NULL, 1, NULL, 1),
        (4, '2026-01-22 00:00:00', 'Almoço de confraternização', 450.00, 450.00, NULL, NULL, NULL, NULL, 2)`,
      4,
      queryRunner,
    );

    await this.seed(
      'balance',
      'id',
      '"id", "incomes_id", "expenses_id", "balance_date", "description", "value", "balance", "member_id", "club_id"',
      `(1, 4, NULL, '2026-01-12 00:00:00', 'Receita: doação empresarial', 5000.00, 5000.00, NULL, 1),
        (2, NULL, 1, '2026-01-05 00:00:00', 'Despesa: material projeto', 1200.00, 3800.00, NULL, 1),
        (3, 1, NULL, '2026-01-10 00:00:00', 'Receita: mensalidade João', 180.00, 3980.00, 1, 1),
        (4, 3, NULL, '2026-01-08 00:00:00', 'Receita: mensalidade Ana', 180.00, 180.00, 4, 2),
        (5, NULL, 4, '2026-01-22 00:00:00', 'Despesa: almoço confraternização', 450.00, -270.00, NULL, 2)`,
      5,
      queryRunner,
    );

    const mgmRows = [
      '(1, 1, 1)', '(1, 2, 1)', '(1, 3, 1)',
      '(2, 1, 1)', '(2, 3, 1)',
      '(3, 4, 2)', '(3, 5, 2)',
    ];
    await queryRunner.query(`
      INSERT INTO "meetings_members" ("meetings_id", "members_id", "club_id") VALUES ${mgmRows.join(',')}
      ON CONFLICT ("meetings_id", "members_id") DO NOTHING;
    `);

    const mmRows = ['(1, 1, 1)', '(3, 2, 2)'];
    await queryRunner.query(`
      INSERT INTO "meetings_minutes" ("meetings_id", "minutes_id", "club_id") VALUES ${mmRows.join(',')}
      ON CONFLICT ("meetings_id", "minutes_id") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "meetings_minutes";`);
    await queryRunner.query(`DELETE FROM "meetings_members";`);
    await queryRunner.query(`DELETE FROM "balance";`);
    await queryRunner.query(`DELETE FROM "expenses";`);
    await queryRunner.query(`DELETE FROM "incomes";`);
    await queryRunner.query(`DELETE FROM "minutes";`);
    await queryRunner.query(`DELETE FROM "meetings";`);
    await queryRunner.query(`DELETE FROM "monthly_fee";`);
    await queryRunner.query(`DELETE FROM "management";`);
    await queryRunner.query(`DELETE FROM "members";`);
    await queryRunner.query(`DELETE FROM "profiles";`);
    await queryRunner.query(`UPDATE "club" SET "address_id" = NULL WHERE "id" IN (1, 2);`);
    await queryRunner.query(`DELETE FROM "address";`);
    await queryRunner.query(`DELETE FROM "club";`);
    await queryRunner.query(`DELETE FROM "city";`);
    await queryRunner.query(`DELETE FROM "state";`);
    await queryRunner.query(`DELETE FROM "country";`);
  }
}
