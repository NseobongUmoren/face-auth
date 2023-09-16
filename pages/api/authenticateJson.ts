import { List } from '@/components/StudentDetails';
import fs from 'fs/promises'; // Node.js filesystem module
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query: { id } } = req;
  if (typeof id !== 'string' || !id) {
    return res.status(400).json({ error: 'Missing student ID' });
  }

  // Extract the values you want to update from the request body
  const { status, compare, capture } = req.body;

  try {
    // Read the JSON file
    const data = await fs.readFile('/studentlist.json', 'utf8');
    const studentList = JSON.parse(data);

    // Find the student by ID
    const studentIndex = studentList.findIndex((student: List) => student.id === parseInt(id));

    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update the specified fields
    studentList[studentIndex].status = status;
    studentList[studentIndex].compare = compare;
    studentList[studentIndex].capture = capture;

    // Write the updated data back to the JSON file
    await fs.writeFile('/studentlist.json', JSON.stringify(studentList, null, 2), 'utf8');

    res.status(200).json({ authenticated: true, message: 'Student information updated successfully' });
  } catch (error) {
    console.error('Error updating student information:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
