import { createPool } from 'mysql2/promise';

const dbConfig = {
  host: 'https://aws.connect.psdb.cloud',
  user: '4kamkooi3ijukrd3z3on',
  password: 'pscale_pw_4t6kbzvc13dTuw62phopKUPfTu1WEljtxTOuN8BZXzh',
  database: 'face-auth',
  port: 3306
};

const pool = createPool(dbConfig);

export default pool;
