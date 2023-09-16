import pool from '@/db';
import { NextApiRequest, NextApiResponse } from 'next';

function isErrorWithMessage(error: any): error is Error {
  return typeof error === 'object' && 'message' in error;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query: { id } } = req;
  if (!id) {
    return res.status(400).json({ error: 'Missing student ID' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT ID as id, NAME as name, JAMBNO as jambNo, EMAIL as email, PHONE as phone, GENDER as gender, COURSE as course, PHOTO as photo, CAPTURE as capture, COMPARE as compare, STATUS as status FROM studentlist_tb WHERE ID = ?', [id]);
    connection.release();

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = rows[0];

    res.status(200).json({ student });
  } catch (error:any) {
    if (isErrorWithMessage(error)) {
      console.error('Error executing SQL:', error.message);
      res.status(500).json({ error: 'Internal Server Error' + error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
