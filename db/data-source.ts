import { DataSource } from 'typeorm';
import 'dotenv/config';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'production' ? false : false,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsRun: true,
});

export default AppDataSource;
