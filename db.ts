import { createPool } from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'face_auth',
  port: 3306
};

const pool = createPool(dbConfig);

export default pool;
