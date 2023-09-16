import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { List } from '@/components/StudentDetails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query: { id } } = req;
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Missing student ID' });
  }

  try {
    // Find the absolute path of the JSON directory
    const jsonDirectory = path.join(process.cwd(), '');

    // Read the JSON file
    const filePath = path.join(jsonDirectory, 'studentlist.json');
    const data = await fs.readFile(filePath, 'utf8');
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
