import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMembersTable1739735529822 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'members',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'admit_date',
            type: 'date',
          },
          {
            name: 'sponsor_id',
            type: 'int',
          },
          {
            name: 'birthday',
            type: 'date',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'rotary_id',
            type: 'int',
          },
          {
            name: 'profile_id',
            type: 'int',
          },
          {
            name: 'fee_balance',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'monthly_fee_division_id',
            type: 'int',
          },
          {
            name: 'honorary',
            type: 'boolean',
          },
          {
            name: 'status',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdBy',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedBy',
            type: 'varchar',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'dtLastAccess',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'members',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profiles',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('members');
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('profile_id') !== -1,
    );
    await queryRunner.dropForeignKey('members', foreignKey!);
    await queryRunner.dropTable('members');
  }
}
