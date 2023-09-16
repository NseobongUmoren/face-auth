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

  // Extract the values you want to update from the request body
  const { status, compare, capture } = req.body;

  try {
    const connection = await pool.getConnection();

    // Use an UPDATE SQL query to update the specified fields
    await connection.execute(
      'UPDATE studentlist_tb SET STATUS = ?, COMPARE = ?, CAPTURE = ? WHERE ID = ?',
      [status, compare, capture, id]
    );

    connection.release();

    res.status(200).json({authenticated: true, message: 'Student information updated successfully' });
  } catch (error: any) {
    if (isErrorWithMessage(error)) {
      console.error('Error executing SQL:', error.message);
      res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
