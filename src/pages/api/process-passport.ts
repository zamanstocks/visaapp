import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import { processFiles } from './passport';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable(); // Initialize file parser
    const [fields, files] = await form.parse(req);
    const passportFile = files.passport?.[0];
    const photoFile = files.photo?.[0];

    if (!passportFile?.filepath || !photoFile?.filepath) {
      console.error('Files missing for processing');
      return res.status(400).json({ error: 'Both passport and photo files are required' });
    }

    const passportBuffer = await fs.readFile(passportFile.filepath);
    const photoBuffer = await fs.readFile(photoFile.filepath);

    // Extract user data from form fields
    const userData = {
      firstName: Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName || '',
      lastName: Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName || '',
      phone: Array.isArray(fields.phone) ? fields.phone[0] : fields.phone || '',
      destination: Array.isArray(fields.destination) ? fields.destination[0] : fields.destination || '',
      visaType: Array.isArray(fields.visaType) ? fields.visaType[0] : fields.visaType || ''
    };

    const result = await processFiles(
      passportBuffer,
      photoBuffer,
      passportFile.originalFilename || 'passport.jpg',
      photoFile.originalFilename || 'photo.jpg',
      userData
    );

    try {
      await fs.unlink(passportFile.filepath); // Clean up temporary files
      await fs.unlink(photoFile.filepath);
    } catch (unlinkError) {
      console.error('Failed to clean up temporary files:', unlinkError);
    }

    if (!result.success) {
      console.error('Processing failed:', result.error);
      return res.status(400).json({ error: result.error });
    }

    console.log('Processing completed:', result.data);
    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
