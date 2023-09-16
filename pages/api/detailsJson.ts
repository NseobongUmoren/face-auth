import { List } from '@/components/StudentDetails';
import fs from 'fs/promises'; // Node.js filesystem module
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query: { id } } = req;
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Missing student ID' });
  }

  try {
    // Read the JSON file
    const data = await fs.readFile(process.env.STUDENT_LIST || '', 'utf8');
    const studentList = JSON.parse(data);

    // Find the student by ID
    const student = studentList.find((student: List) => student.id === parseInt(id));

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
