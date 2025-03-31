import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile } from '../../lib/fileUpload';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const file = req.files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const uploadResult = await uploadFile(file);
    
    if (!uploadResult.success) {
      return res.status(500).json({ message: 'Failed to upload file' });
    }

    return res.status(200).json(uploadResult);
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 