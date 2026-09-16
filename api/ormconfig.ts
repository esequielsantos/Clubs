import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const isPostgres = process.env.DB_DRIVER === 'postgres';
const useSync = process.env.DB_SYNCHRONIZE === 'true';

const entities = [__dirname + '/src/**/*.entity{.ts,.js}'];
const migrations = [__dirname + '/migrations/*.{ts,js}'];
const subscribers = [__dirname + '/src/**/*.subscriber{.ts,.js}'];
const migrationsRun = process.env.DB_MIGRATIONS_RUN === 'true';
const synchronize = useSync;
const logging = process.env.DB_LOGGING === 'true';

function buildConfig(): DataSourceOptions {
  if (isPostgres) {
    return {
      type: 'postgres',
      entities,
      migrations,
      subscribers,
      migrationsRun,
      synchronize,
      logging,
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_DATABASE ?? 'clubs',
      schema: process.env.DB_SCHEMA ?? 'public',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      extra: {
        max: Number(process.env.DB_POOL_MAX ?? 20),
      },
    } satisfies DataSourceOptions;
  }

  return {
    type: 'sqlite',
    entities,
    migrations,
    subscribers,
    migrationsRun,
    synchronize,
    logging,
    database: process.env.DB_SQLITE_PATH ?? 'club.db',
  } satisfies DataSourceOptions;
}

export const ormconfig: DataSourceOptions = buildConfig();

export const AppDataSource = new DataSource(ormconfig);

export default ormconfig;
