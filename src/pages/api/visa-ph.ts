import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { VisaApplication, PassportData } from './types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { passportData, files, ...applicationData }:
      VisaApplication & { passportData: PassportData } = req.body;

    const insertData = {
      created_at: new Date().toISOString(),
      phone_number: applicationData.phone,
      email: applicationData.email,
      destination: applicationData.destination,
      visa_type: applicationData.visa_type,
      nationality: 'PHILIPPINES',
      status: 'draft',
      document_status: 'processing',
      ...passportData,
      files,
      application_key: `${applicationData.phone}_PH_${applicationData.destination}_${Date.now()}`
    };

    const { data: existingApp } = await supabase
      .from('visa_ph')
      .select('id')
      .match({
        phone_number: applicationData.phone,
        status: 'draft'
      })
      .single();

    const operation = existingApp
      ? supabase.from('visa_ph').update(insertData).eq('id', existingApp.id)
      : supabase.from('visa_ph').insert([insertData]);

    const { data, error } = await operation.select().single();
    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Database operation failed'
    });
  }
}
