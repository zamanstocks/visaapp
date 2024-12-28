import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const config = { api: { bodyParser: false } };

interface UploadSession {
  passport?: Buffer;
  photo?: Buffer;
}

const sessions: Record<string, UploadSession> = {};

const generateFileName = (ext: string) => {
  const date = new Date();
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}${ext}`;
};

async function processPassport(passport: Buffer, photo: Buffer) {
  console.log('Processing passport and photo');
  const base64Passport = passport.toString('base64');
  const base64Photo = photo.toString('base64');

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
      role: "user",
      content: [
        {
          type: "text",
          text: `Analyze the passport and photo provided. Extract the details in the specified format.
          
Important formatting rules:
- All dates must be in ISO format (YYYY-MM-DD)
- Names should be in UPPERCASE
- Passport numbers should preserve their exact format
- Place names should be in Title Case
- Country names should be in Title Case

Extract the data in this exact JSON structure:
{
  "passport_number": "",
  "given_name": "",
  "family_name": "",
  "date_of_birth": "", // YYYY-MM-DD format
  "gender": "",
  "issuing_state": "",
  "travel_doc_type": "",
  "issue_date": "", // YYYY-MM-DD format
  "expiry_date": "", // YYYY-MM-DD format
  "place_of_issue": "",
  "nationality": "",
  "place_of_birth": "",
  "country_of_birth": "",
  "last_departure_country": "",
  "mother_name": null,
  "father_name": null,
  "marital_status": ""
}

Example response:
{
  "passport_number": "P1234567",
  "given_name": "JOHN",
  "family_name": "SMITH",
  "date_of_birth": "1990-05-15",
  "gender": "M",
  "issuing_state": "United Kingdom",
  "travel_doc_type": "P",
  "issue_date": "2020-01-01",
  "expiry_date": "2030-01-01",
  "place_of_issue": "London",
  "nationality": "British",
  "place_of_birth": "Manchester",
  "country_of_birth": "United Kingdom",
  "last_departure_country": "France",
  "mother_name": null,
  "father_name": null,
  "marital_status": "Single"
}`
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Passport}`,
            detail: "high"
          }
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Photo}`,
            detail: "high"
          }
        }
      ]
    }],
    max_tokens: 1000,
    temperature: 0,
    response_format: { type: "json_object" }
  });

  const parsedData = JSON.parse(response.choices[0]?.message?.content || 'null');
  
  // Ensure all dates are in ISO format
  if (parsedData) {
    ['date_of_birth', 'issue_date', 'expiry_date'].forEach(dateField => {
      if (parsedData[dateField]) {
        try {
          const date = new Date(parsedData[dateField]);
          parsedData[dateField] = date.toISOString().split('T')[0];
        } catch (e) {
          console.error(`Error formatting date for ${dateField}:`, e);
        }
      }
    });
    
    // Ensure names are uppercase
    ['given_name', 'family_name'].forEach(nameField => {
      if (parsedData[nameField]) {
        parsedData[nameField] = parsedData[nameField].toUpperCase();
      }
    });
    
    // Ensure place names and countries are in Title Case
    ['issuing_state', 'place_of_issue', 'nationality', 'place_of_birth', 'country_of_birth', 'last_departure_country'].forEach(field => {
      if (parsedData[field]) {
        parsedData[field] = parsedData[field]
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
    });
  }

  return parsedData;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      filename: (_name, ext) => generateFileName(ext)
    });

    const formData: [Fields, Files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const [fields, files] = formData;
    const file = files.file?.[0];
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fieldName = fields.fieldName?.[0];
    const nationality = fields.nationality?.[0];
    const phone = fields.phone?.[0];
    const sessionId = `${phone}_${nationality}`;

    if (!sessions[sessionId]) {
      sessions[sessionId] = {};
    }

    const fileBuffer = await fs.readFile(file.filepath);
    const fileInfo = {
      filepath: `/uploads/${file.newFilename}`,
      filename: file.newFilename,
      type: file.mimetype,
      size: file.size,
      timestamp: new Date().toISOString()
    };

    let passportData = null;
    if (fieldName?.includes('passport')) {
      sessions[sessionId].passport = fileBuffer;
    } else if (fieldName === 'photo') {
      sessions[sessionId].photo = fileBuffer;
    }

    if (sessions[sessionId].passport && sessions[sessionId].photo) {
      console.log('Both files uploaded, processing OCR');
      passportData = await processPassport(sessions[sessionId].passport, sessions[sessionId].photo);
      console.log('OCR Result:', passportData);
      delete sessions[sessionId];
    }

    const processedData = {
      passport_data: passportData,
      upload_info: {
        fieldName,
        ...fileInfo
      }
    };

    res.status(200).json({
      success: true,
      data: {
        id: Date.now().toString(),
        processedData
      }
    });
  } catch (error) {
    console.error('Handler Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed'
    });
  }
}