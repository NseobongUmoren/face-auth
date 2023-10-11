import { createPool } from 'mysql2/promise';
import fs from 'fs'; // Node.js file system module

const dbConfig = {
  host: 'aws.connect.psdb.cloud',
  user: 'zq5k01fngh0s84whq87n',
  password: 'pscale_pw_XLGQwWOwvIYowNlo9aBl5bDQWs9U5gteQhq32hPxStg',
  database: 'face-auth',
  port: 3306,
  ssl: {
    ca: fs.readFileSync('/etc/pki/tls/certs/ca-bundle.crt'), // Replace with the path to your CA certificate
  },
};

const pool = createPool(dbConfig);

export default pool;

