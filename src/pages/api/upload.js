import { NextApiRequest, NextApiResponse } from 'next';
import { uploadFile } from '@/lib/fileUpload';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Upload to Firebase Storage
    const uploadResult = await uploadFile(file);
    
    if (!uploadResult.success) {
      return res.status(500).json({ message: 'Failed to upload file' });
    }

    // Save file information to database
    const savedFile = await prisma.file.create({
      data: {
        filename: uploadResult.filename,
        url: uploadResult.url,
        type: file.type,
        size: file.size,
        uploadedBy: req.body.userId || 'anonymous', // You can replace this with actual user ID
      },
    });

    return res.status(200).json(savedFile);
  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 