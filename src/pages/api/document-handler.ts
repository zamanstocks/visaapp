import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

async function processPassportImage(imageBuffer: Buffer, isLastPage: boolean = false) {
  try {
    const base64Image = imageBuffer.toString('base64');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: isLastPage ? 
            "Extract address and additional details from passport last page." :
            "Extract main identification details from passport photo page."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this passport image and extract information in this JSON format:
              {
                "passport_number": "",
                "given_name": "",
                "family_name": "",
                "date_of_birth": "",
                "gender": "",
                "issuing_state": "",
                "travel_doc_type": "Passport",
                "issue_date": "",
                "expiry_date": "",
                "place_of_issue": "",
                "country_of_birth": "",
                "place_of_birth": "",
                "nationality": "",
                "last_departure_country": "",
                "applying_country": "",
                "visa_type_key": "",
                "address": ""
              }
              Rules:
              - Use UPPERCASE for countries
              - Format dates as YYYY-MM-DD
              - Empty string for missing fields
              - Extract all visible information`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return {};
    
    // Clean the content and attempt to parse
    const cleanedContent = content.replace(/[\u200B-\u200D\uFEFF]/g, '')  // Remove zero-width spaces
                                 .replace(/```json\s*|\s*```/g, '')        // Remove code blocks
                                 .trim();
    try {
        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error('JSON Parse Error:', cleanedContent);
        return {};
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to process image');
  }
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
      maxFileSize: 10 * 1024 * 1024,
      filename: (name, ext, part) => {
        const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
        return `${part.name || 'unknown'}-${timestamp}${ext}`.toLowerCase().replace(/\s+/g, '-');
      },
    });

    return new Promise((resolve) => {
      form.parse(req, async (err, fields: FormFields, files: formidable.Files) => {
        if (err) {
          res.status(500).json({ message: 'Upload failed', error: err.message });
          return resolve(undefined);
        }

        const file = files.file?.[0];
        if (!file) {
          res.status(400).json({ message: 'No file provided' });
          return resolve(undefined);
        }

        try {
          let passportData = null;
          if (!fields.fieldName?.[0]?.toLowerCase().includes('photo')) {
            const imageBuffer = fs.readFileSync(file.filepath);
            const isLastPage = fields.fieldName?.[0]?.toLowerCase().includes('last') || 
                             fields.fieldName?.[0]?.toLowerCase().includes('back');
            passportData = await processPassportImage(imageBuffer, isLastPage);
          }

          const newFilename = `${fields.firstName?.[0] || 'unknown'}-${fields.fieldName?.[0] || 'document'}-${format(new Date(), 'yyyyMMdd-HHmmss')}${path.extname(file.originalFilename || '')}`.toLowerCase().replace(/\s+/g, '-');
          const newPath = path.join(uploadDir, newFilename);

          fs.renameSync(file.filepath, newPath);

          const uploadedFile = {
            fieldName: fields.fieldName?.[0],
            filename: newFilename,
            filepath: `/uploads/${newFilename}`,
            size: file.size,
            type: file.mimetype,
          };

          res.status(200).json({
            message: 'File uploaded and processed successfully',
            file: uploadedFile,
            passportData
          });
          
          resolve(undefined);
        } catch (err) {
          const error = err as Error;
          console.error('Processing error:', error);
          res.status(500).json({ 
            message: 'Failed to process passport data',
            error: error.message || 'Unknown error'
          });
          resolve(undefined);
        }
      });
    });
  } catch (err) {
    const error = err as Error;
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}