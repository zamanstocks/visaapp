import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Type definitions
type VisaApplication = {
  id: string;
  application_number: string;
  phone_number: string;
  destination: string;
  visa_type: string;
  nationality: string;
  email: string;
  status: string;
  document_status: string;
  files: Record<string, any>;
  total_files_required: number;
  files_uploaded: number;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  is_indian_passport: boolean;
  passport_data: Record<string, any> | null;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function getApplication(id: string): Promise<VisaApplication> {
  const { data, error } = await supabase
    .from('visa_applications')
    .select(`
      id,
      application_number,
      phone_number,
      destination,
      visa_type,
      nationality,
      email,
      status,
      document_status,
      files,
      total_files_required,
      files_uploaded,
      created_at,
      updated_at,
      submitted_at,
      is_indian_passport,
      passport_data
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Application not found');
  }

  return data;
}

async function updateApplication(id: string, updates: Partial<VisaApplication>): Promise<VisaApplication> {
  const { data, error } = await supabase
    .from('visa_applications')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('Application not found');
  }

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<VisaApplication>>
) {
  const { id } = req.query;

  // Validate ID parameter
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid application ID'
    });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const data = await getApplication(id);
        return res.status(200).json({
          success: true,
          data
        });
      }

      case 'PATCH': {
        const updates = req.body;
        const data = await updateApplication(id, updates);
        return res.status(200).json({
          success: true,
          data
        });
      }

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error && error.message === 'Application not found') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}