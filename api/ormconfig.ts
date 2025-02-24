import { DataSourceOptions } from 'typeorm';

export const ormconfig: DataSourceOptions = {
  type: 'sqlite',
  database: '../../ClubsDb/club.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.{.ts,.js}'],
  synchronize: true,
};
