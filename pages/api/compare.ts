// pages/api/admission.ts

import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    
    try {
      // Check if a file was uploaded
      if (!req.body || !req.body.image2) {
        return res.status(400).json({ error: 'No file uploaded1' });
      }
      if (!req.body) {
        return res.status(400).json({ error: 'No file uploaded2' });
      }

      const newBody = (req.body)
      if (!newBody || !newBody.image2) {
        return res.status(400).json({ error: 'No file uploaded3' });
      }

      const image1 = req.body.image1.split(',')[1];
      const image2 = req.body.image2.split(',')[1];

      // Set headers for the Face++ API request
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      // Make a request to Face++ for face comparison
      const { data } = await axios.post('https://api-us.faceplusplus.com/facepp/v3/compare', {
        api_key: process.env.FACEPP_API_KEY,
        api_secret: process.env.FACEPP_API_SECRET,
        image_base64_1: image1,
        image_base64_2: image2,
      }, { headers }); 
      

      // Check the response from Face++ and determine if the student is authenticated
      if (data.confidence >= 80) {
        // Authentication successful
        res.status(200).json({ authenticated: true, compare: data });
      } else {
        // Authentication failed
        res.status(403).json({ authenticated: false, message: "FACE MISMATCH", compare: data });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error:', error.response);
        // You can access the status code and error message
        res.status(error.response?.status || 500).json({ error: error.response?.data });
      } else {
        // Handle non-Axios errors
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
