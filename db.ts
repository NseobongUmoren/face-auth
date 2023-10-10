import { createPool } from 'mysql2/promise';

const dbConfig = {
  host: 'https://redemptionfm.com',
  user: 'redempt2_faceauth',
  password: 'redempt2_faceauth',
  database: 'redempt2_faceauth',
  port: 3306
};

const pool = createPool(dbConfig);

export default pool;
