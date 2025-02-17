import { DataSourceOptions } from 'typeorm';

export const ormconfig: DataSourceOptions = {
  type: 'sqlite',
  name: 'dataConnection',
  database: 'club.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: true,
};
