import OpenAI from 'openai';
import { FileStorage } from '../../lib/fileStorage';
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_KEY');
if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

// Supabase Configuration
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface ProcessResult {
  success: boolean;
  data?: {
    applicant: {
      nationality: { name: string; code: string };
      visa_applying_country: { name: string; code: string };
      place_of_birth: string;
      country_of_birth: { name: string; code: string };
      date_of_birth: string;
      gender: string;
      family_name: string;
      given_name: string;
      mother_name: string;
      marital_status: string;
      place_of_issue: string;
      issue_date: string;
      expiry_date: string;
      document_number: string;
    };
  };
  filePaths?: { passport: string; photo: string };
  error?: string;
}

export async function processFiles(
  passportBuffer: Buffer,
  photoBuffer: Buffer,
  passportFilename: string,
  photoFilename: string,
  userData: { firstName: string; lastName: string; phone: string; destination: string; visaType: string }
): Promise<ProcessResult> {
  try {
    // Save the uploaded files
    const passportPath = await FileStorage.savePassport(passportBuffer, passportFilename);
    const photoPath = await FileStorage.savePassport(photoBuffer, photoFilename);

    // Convert passport image to base64 for OpenAI processing
    const base64Image = passportBuffer.toString('base64');

    // Request data extraction from OpenAI for the passport
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Extract passport data in exact JSON format:
          {
            "nationality": { "name": "", "code": "" },
            "visa_applying_country": { "name": "", "code": "" },
            "place_of_birth": "",
            "country_of_birth": { "name": "", "code": "" },
            "date_of_birth": "",
            "gender": "",
            "family_name": "",
            "given_name": "",
            "mother_name": "",
            "marital_status": "",
            "place_of_issue": "",
            "issue_date": "",
            "expiry_date": "",
            "document_number": ""
          }`
        },
        {
          role: "user",
          content: `data:image/jpeg;base64,${base64Image}`
        }
      ],
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty API response');

    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsedData = JSON.parse(jsonStr);

    // Insert into Supabase
    const { data, error } = await supabase.from('visa_applications').insert([
      {
        given_name: parsedData.given_name || '',
        family_name: parsedData.family_name || '',
        place_of_birth: parsedData.place_of_birth || 'Unknown',
        country_of_birth: parsedData.country_of_birth?.name || 'Unknown',
        date_of_birth: parsedData.date_of_birth || '1900-01-01',
        gender: parsedData.gender || 'Unknown',
        place_of_issue: parsedData.place_of_issue || 'Unknown',
        issue_date: parsedData.issue_date || '1900-01-01',
        expiry_date: parsedData.expiry_date || '1900-01-01',
        document_number: parsedData.document_number || '',
        passport_file_path: passportPath,
        photo_file_path: photoPath,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        destination: userData.destination,
        visaType: userData.visaType,
        status: 'pending'
      }
    ]);

    if (error) throw new Error(`Supabase Error: ${error.message}`);

    console.log('Inserted to Supabase:', data);

    return {
      success: true,
      data: { applicant: parsedData },
      filePaths: { passport: passportPath, photo: photoPath }
    };
  } catch (error) {
    console.error('Error processing files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process files'
    };
  }
}