// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error('Missing SUPABASE_KEY');

export type VisaApplication = {
  id: string;
  user_id?: string;
  phone_number: string;
  applicant_name: string;
  destination: string;
  visa_type: string;
  nationality: string;
  email?: string;
  status?: string;
  passport_data: {
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
  };
  document_status?: string;
  files: Record<string, any>;
  total_files_required?: number;
  files_uploaded?: number;
  created_at?: string;
  updated_at?: string;
  is_indian_passport?: boolean;
  application_identifier?: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
);

export default supabase;