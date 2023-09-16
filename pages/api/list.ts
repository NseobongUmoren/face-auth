import pool from '@/db';
// import Error from 'next/error';
import { NextApiRequest, NextApiResponse } from 'next';

function isErrorWithMessage(error: any): error is Error {
  return typeof error === 'object' && 'message' in error;
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT ID as id, NAME as name, JAMBNO as jambNo, EMAIL as email, PHONE as phone, GENDER as gender, COURSE as course, PHOTO as photo FROM studentlist_tb');
    connection.release();
    res.status(200).json(rows);
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