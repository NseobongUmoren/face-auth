import path from 'path';
import { promises as fs } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Find the absolute path of the JSON file
    const jsonDirectory = path.join(process.cwd(), 'public');
    const filePath = path.join(jsonDirectory, 'studentlist.json');

    // Read the JSON file
    const data = await fs.readFile(filePath, 'utf8');
    const studentList = JSON.parse(data);

    // Send the data as response
    res.status(200).json(studentList);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal Server Error ' + error });
  }
}
