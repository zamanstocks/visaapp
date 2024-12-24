import OpenAI from 'openai';
import { FileStorage } from '../../lib/fileStorage';
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_KEY');
if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');

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
  progress?: number;
}

export async function processFiles(
  passportBuffer: Buffer,
  photoBuffer: Buffer,
  passportFilename: string,
  photoFilename: string,
  userData: { 
    firstName: string; 
    phone: string; 
    destination: string; 
    visaType: string;
    email?: string;
    nationality?: string;
  }
): Promise<ProcessResult> {
  try {
    // Step 1: Save files (20% progress)
    const passportPath = await FileStorage.savePassport(passportBuffer, passportFilename);
    const photoPath = await FileStorage.savePassport(photoBuffer, photoFilename);

    // Step 2: Prepare image for OCR (40% progress)
    const base64Image = passportBuffer.toString('base64');

    // Step 3: OCR Processing (60% progress)
    console.log('Starting OCR processing...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract all passport data carefully in exact JSON format. 
                    Ensure precise extraction of every detail visible, including codes.
                    Verify the format matches exactly with no missing fields.`
            },
            {
              type: "image_url",
              image_url: `data:image/jpeg;base64,${base64Image}`
            }
          ]
        }
      ],
      max_tokens: 1000
    });

    // Step 4: Parse OCR Results (80% progress)
    console.log('Processing OCR results...');
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty API response');

    const jsonStr = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const parsedData = JSON.parse(jsonStr);

    // Step 5: Save to Supabase (100% progress)
    console.log('Saving to database...');
    const { data, error } = await supabase.from('visa_applications').insert([
      {
        // OCR extracted data (keeping exact structure)
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
        nationality: parsedData.nationality?.name || 'Unknown',
        nationality_code: parsedData.nationality?.code || '',
        mother_name: parsedData.mother_name || '',
        marital_status: parsedData.marital_status || '',

        // File paths
        passport_file_path: passportPath,
        photo_file_path: photoPath,

        // User provided data
        firstName: userData.firstName,
        phone: userData.phone,
        email: userData.email || '',
        destination: userData.destination,
        visaType: userData.visaType,
        nationality_input: userData.nationality || '',

        // Metadata
        status: 'pending',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error('Database Error:', error);
      throw new Error(`Supabase Error: ${error.message}`);
    }

    console.log('Process completed successfully');
    return {
      success: true,
      data: { applicant: parsedData },
      filePaths: { passport: passportPath, photo: photoPath },
      progress: 100
    };

  } catch (error) {
    console.error('Process Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process files',
      progress: 0
    };
  }
}