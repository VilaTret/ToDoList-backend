import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { join } from 'path';
import * as process from 'process';

dotenv.config();

export const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [join(__dirname, 'src', './**/**/entities/*{.ts,.js}')],
  migrationsTableName: 'migration',
  migrations: [join(__dirname, 'src', './migrations/*{.ts,.js}')],
};

export default new DataSource(options);
