import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FormFields {
  firstName?: string[];
  nationality?: string[];
  phone?: string[];
  fieldName?: string[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filename: (name, ext, part) => {
        const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
        return `${part.name || 'unknown'}-${timestamp}${ext}`.toLowerCase().replace(/\s+/g, '-');
      },
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields: FormFields, files: formidable.Files) => {
        if (err) {
          console.error('Upload error:', err);
          res.status(500).json({ message: 'Upload failed', error: err.message });
          return resolve(undefined);
        }

        const fileField = Object.values(files)[0]?.[0];
        if (!fileField) {
          res.status(400).json({ message: 'No file provided' });
          return resolve(undefined);
        }

        // Rename file with user details after upload
        const newFilename = `${fields.firstName?.[0] || 'unknown'}-${fields.nationality?.[0] || 'unknown'}-${fields.fieldName?.[0] || 'document'}-${format(new Date(), 'yyyyMMdd-HHmmss')}${path.extname(fileField.originalFilename || '')}`.toLowerCase().replace(/\s+/g, '-');
        
        const newPath = path.join(uploadDir, newFilename);
        fs.renameSync(fileField.filepath, newPath);

        const uploadedFile = {
          fieldName: fields.fieldName?.[0],
          filename: newFilename,
          filepath: newPath,
          size: fileField.size,
          type: fileField.mimetype,
        };

        res.status(200).json({
          message: 'File uploaded successfully',
          file: uploadedFile,
        });
        resolve(undefined);
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}