import { createPool } from 'mysql2/promise';
import fs from 'fs'; // Node.js file system module

const dbConfig:Record<string,any> = {
  host: String(process.env.DATABASE_HOST),
  user: String(process.env.DATABASE_USER),
  password: String(process.env.DATABASE_PASSWORD),
  database: String(process.env.DATABASE_NAME),
  port: Number(process.env.DATABASE_PORT),
};



if (String(process.env.DATABASE_CA) !== '') {
  dbConfig.ssl = {
    ca: fs.readFileSync(String(process.env.DATABASE_CA)), // Replace with the path to your CA certificate
  }
}

const pool = createPool(dbConfig);

export default pool;

