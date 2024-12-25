import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle, FileText, Shield, CreditCard } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VisaApplication {
  id: string;
  applicant_name: string;
  phone_number: string;
  destination: string;
  visa_type: string;
  nationality: string;
  email: string;
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
    mother_name: string | null;
    father_name: string | null;
    marital_status: string;
  };
  files: Record<string, { filepath: string; filename: string }>;
  document_status: string;
  status: string;
  is_indian_passport: boolean;
}

function EditableField({ label, value, onChange, readOnly = false }: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="group relative">
      <label className="absolute -top-2 left-2 px-2 bg-white text-xs font-semibold text-gray-600">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly}
        className={`w-full p-3 text-sm border rounded-lg transition-shadow
                   ${readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-blue-400'}
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
      />
    </div>
  );
}

function DocumentCard({ title, filename }: { title: string; filename: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <FileText className="w-12 h-12 text-blue-500/50" />
      </div>
      <div className="p-3 border-t">
        <h4 className="font-medium text-gray-800 truncate">{title}</h4>
        <p className="text-xs text-gray-500 truncate mt-0.5">{filename}</p>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [application, setApplication] = useState<VisaApplication | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const phone = searchParams.get('phone');
        const { data, error } = await supabase
          .from('visa_applications')
          .select('*')
          .eq('phone_number', phone)
          .eq('status', 'draft')
          .single();

        if (error) throw error;
        setApplication(data);
      } catch (err) {
        setError('Failed to load application data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!application) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('visa_applications')
        .update({
          ...application,
          status: 'pending_payment',
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (error) throw error;
      router.push(`/payment?id=${application.id}`);
    } catch (err) {
      setError('Failed to update application');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-xl">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-500 mb-6">We couldn't find your application details.</p>
          <button onClick={() => router.push('/')} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <nav className="flex justify-between items-center">
          <button onClick={() => router.back()} 
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:border-blue-300 transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          {isEditing && (
            <button onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          )}
        </nav>

        <main className="relative">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <div>
                  <h1 className="text-xl font-semibold">Verify Your Details</h1>
                  <p className="text-blue-100 text-sm">Please review and confirm your information</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid gap-8">
              <div className="grid md:grid-cols-2 gap-6">
                <EditableField
                  label="Full Name"
                  value={application.applicant_name}
                  onChange={value => setApplication(prev => 
                    prev ? { ...prev, applicant_name: value } : null
                  )}
                  readOnly={!isEditing}
                />
                <EditableField
                  label="Phone Number"
                  value={application.phone_number}
                  readOnly={true}
                />
                <EditableField
                  label="Destination"
                  value={application.destination}
                  readOnly={true}
                />
                <EditableField
                  label="Visa Type"
                  value={application.visa_type}
                  readOnly={true}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>Passport Details</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Verified</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(application.passport_data).map(([key, value]) => (
                    key !== 'travel_doc_type' && (
                      <EditableField
                        key={key}
                        label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        value={value || ''}
                        onChange={value => setApplication(prev => 
                          prev ? {
                            ...prev,
                            passport_data: { ...prev.passport_data, [key]: value }
                          } : null
                        )}
                        readOnly={!isEditing}
                      />
                    )
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(application.files).map(([key, file]) => (
                    file && (
                      <DocumentCard
                        key={key}
                        title={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        filename={file.filename}
                      />
                    )
                  ))}
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="p-6 bg-gray-50 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                           text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg animate-shake">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}