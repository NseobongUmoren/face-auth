import fs from 'fs/promises'; // Node.js filesystem module
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read the JSON file
    const data = await fs.readFile('/studentlist.json', 'utf8');
    const studentList = JSON.parse(data);

    // Send the data as response
    res.status(200).json(studentList);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal Server Error ' + error });
  }
}
