import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const config = { api: { bodyParser: false } };

interface FormFields {
  firstName?: string[];
  phone?: string[];
  email?: string[];
  destination?: string[];
  nationality?: string[];
  visaType?: string[];
  fieldName?: string[];
}

interface UploadInfo {
  fieldName: string;
  filename: string;
  filepath: string;
  size: number;
  type: string;
  timestamp: string;
}

interface PassportData {
  passport_number: string;
  given_name: string;
  family_name: string;
  date_of_birth: string;
  gender: string;
  issuing_state: string;
  travel_doc_type: string;
  issue_date: string;
  expiry_date: string;
  place_of_issue: string;
  country_of_birth: string;
  place_of_birth: string | null;
  nationality: string;
  last_departure_country: string;
  mother_name: string | null;
  father_name: string | null;
  marital_status: string;
}

interface ApplicationData {
  user_details: {
    name: string;
    phone: string;
    email: string;
    nationality: string;
  };
  visa_details: {
    destination: string;
    visa_type: string;
  };
  passport_data: PassportData | null;
  upload_info: UploadInfo;
}

const logData = (label: string, data: any) => {
  console.log('\n==========', label, '==========');
  console.log(JSON.stringify(data, null, 2));
  console.log('='.repeat(20 + label.length), '\n');
};

const parseQueryParams = (url: string): Record<string, string> => {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = decodeURIComponent(value);
    });
    return params;
  } catch {
    return {};
  }
};

const sanitizeFields = (fields: FormFields, query: Record<string, string>): {[key: string]: string} => {
  const sanitized = {
    firstName: fields.firstName?.[0]?.trim() || query.firstName || '',
    phone: fields.phone?.[0]?.trim() || query.phone || '',
    email: fields.email?.[0]?.trim() || query.email || '',
    destination: fields.destination?.[0]?.toUpperCase().trim() || query.destination?.toUpperCase() || '',
    nationality: fields.nationality?.[0]?.toUpperCase().trim() || query.nationality?.toUpperCase() || '',
    visaType: fields.visaType?.[0]?.trim() || query.visaType || '',
    fieldName: fields.fieldName?.[0]?.toLowerCase().trim() || ''
  };
  logData('Sanitized Fields', sanitized);
  return sanitized;
};

async function processPassportImage(imageBuffer: Buffer, isLastPage: boolean = false): Promise<PassportData | null> {
  try {
    console.log('\n[Passport Processing Started]');
    console.log(`Processing ${isLastPage ? 'last page' : 'main page'} of passport`);
    
    const base64Image = imageBuffer.toString('base64');
    const systemPrompt = isLastPage
      ? "Extract mother's name and marital status from Indian passport last page. For non-Indian passports or unclear data, return null for these fields."
      : "Extract all visible passport information with high precision, ensuring standardized format for gender, dates, and country names.";
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: `Extract passport information in this format:
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
                "mother_name": null,
                "father_name": null,
                "marital_status": ""
              }
              Rules:
              - Gender: "MALE" or "FEMALE" only
              - Countries and names in UPPERCASE
              - Dates format: YYYY-MM-DD
              - Default country_of_birth to nationality if unspecified
              - Mother/father name: null for non-Indian passports
              - Marital status: "SINGLE"/"MARRIED"/"" if unclear`
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` }
            }
          ]
        }
      ],
      temperature: 0
    });

    logData('OpenAI API Response', {
      id: response.id,
      model: response.model,
      created: response.created,
      response_content: response.choices[0]?.message?.content
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    
    const cleanedContent = content.replace(/[\u200B-\u200D\uFEFF]/g, '')
                                 .replace(/```json\s*|\s*```/g, '')
                                 .trim();
    
    const parsedJSON = JSON.parse(cleanedContent);
    return {
      ...parsedJSON,
      country_of_birth: parsedJSON.country_of_birth || parsedJSON.nationality,
      gender: parsedJSON.gender?.toUpperCase() || "",
      mother_name: parsedJSON.mother_name?.toUpperCase() || null,
      father_name: parsedJSON.father_name?.toUpperCase() || null,
      marital_status: parsedJSON.marital_status?.toUpperCase() || "",
      nationality: parsedJSON.nationality?.toUpperCase() || "",
      issuing_state: parsedJSON.issuing_state?.toUpperCase() || "",
      last_departure_country: parsedJSON.last_departure_country?.toUpperCase() || "",
      place_of_birth: parsedJSON.place_of_birth || null
    };
  } catch (error) {
    console.error('\n[Passport Processing Error]', error);
    return null;
  }
}

async function updateVisaApplication(
  applicationData: ApplicationData,
  isLastPage: boolean = false
): Promise<void> {
  const isIndianPassport = applicationData.user_details.nationality.toLowerCase() === 'india';
  const fileKey = isIndianPassport && !isLastPage ? 'passport_front' : applicationData.upload_info.fieldName;

  const { data: existingApp, error: fetchError } = await supabase
    .from('visa_applications')
    .select('*')
    .eq('phone_number', applicationData.user_details.phone)
    .eq('status', 'draft')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error('Failed to fetch application');
  }

  const files = existingApp?.files || {};
  files[fileKey] = {
    filepath: applicationData.upload_info.filepath,
    filename: applicationData.upload_info.filename,
    type: applicationData.upload_info.type,
    size: applicationData.upload_info.size,
  };

  const updateData = {
    phone_number: applicationData.user_details.phone,
    applicant_name: applicationData.user_details.name,
    destination: applicationData.visa_details.destination,
    visa_type: applicationData.visa_details.visa_type,
    nationality: applicationData.user_details.nationality,
    email: applicationData.user_details.email,
    passport_data: applicationData.passport_data || existingApp?.passport_data,
    files,
    files_uploaded: Object.keys(files).filter(k => files[k]).length,
    is_indian_passport: isIndianPassport,
    total_files_required: isIndianPassport ? 3 : 2,
    document_status: 'processing',
  };

  if (!existingApp) {
    const { error: insertError } = await supabase
      .from('visa_applications')
      .insert([updateData]);
    if (insertError) throw new Error(`Failed to create application: ${insertError.message}`);
  } else {
    const { error: updateError } = await supabase
      .from('visa_applications')
      .update(updateData)
      .eq('id', existingApp.id);
    if (updateError) throw new Error(`Failed to update application: ${updateError.message}`);
  }

  logData('Supabase Update', { existingApp, updateData });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('\n[API Request Started]', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const queryParams = parseQueryParams(`http://localhost${req.url}`);
  logData('Query Parameters', queryParams);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 10 * 1024 * 1024,
    filename: (_name, ext, part) => {
      const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
      return `${part.name || 'unknown'}-${timestamp}${ext}`.toLowerCase().replace(/\s+/g, '-');
    }
  });

  try {
    const [fields, files] = await new Promise<[FormFields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    logData('Received Form Fields', fields);
    logData('Received Files', files);

    const file = files.file?.[0];
    if (!file?.mimetype) {
      return res.status(400).json({ error: 'No file provided or invalid file type' });
    }

    const sanitizedFields = sanitizeFields(fields, queryParams);
    const imageBuffer = await fs.promises.readFile(file.filepath);
    const isLastPage = sanitizedFields.fieldName.includes('last') || sanitizedFields.fieldName.includes('back');
    const passportData = !sanitizedFields.fieldName.includes('photo') 
      ? await processPassportImage(imageBuffer, isLastPage)
      : null;

    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const newFilename = `${sanitizedFields.firstName || 'unknown'}-${sanitizedFields.fieldName || 'document'}-${timestamp}${path.extname(file.originalFilename || '')}`.toLowerCase().replace(/\s+/g, '-');
    const newPath = path.join(uploadDir, newFilename);

    await fs.promises.rename(file.filepath, newPath);

    const applicationData: ApplicationData = {
      user_details: {
        name: sanitizedFields.firstName,
        phone: sanitizedFields.phone,
        email: sanitizedFields.email,
        nationality: sanitizedFields.nationality
      },
      visa_details: {
        destination: sanitizedFields.destination,
        visa_type: sanitizedFields.visaType
      },
      passport_data: passportData,
      upload_info: {
        fieldName: sanitizedFields.fieldName,
        filename: newFilename,
        filepath: `/uploads/${newFilename}`,
        size: file.size,
        type: file.mimetype,
        timestamp
      }
    };

    await updateVisaApplication(applicationData, isLastPage);
    logData('Final Application Data', applicationData);
    
    res.status(200).json({ 
      success: true, 
      data: applicationData 
    });
  } catch (error) {
    console.error('\n[Request Processing Error]', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}