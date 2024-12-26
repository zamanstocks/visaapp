// src/pages/verification.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loader2, ArrowLeft, AlertCircle, Shield, CreditCard, Save, X } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

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
  nationality: string;
}

interface VisaApplication {
  id: string;
  applicant_name: string;
  phone_number: string;
  email: string;
  nationality: string;
  destination: string;
  visa_type: string;
  passport_data: PassportData;
  document_status: string;
  status: string;
  is_indian_passport: boolean;
  files: string[];
  files_uploaded: number;
  total_files_required: number;
  created_at: string;
  updated_at: string;
  application_identifier: string;
}

function EditableField({ 
  label, 
  value, 
  onChange, 
  readOnly = false,
  isEditing = false,
  error = '',
  type = 'text'
}: {
  label: string;
  value: string | undefined | null;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  isEditing?: boolean;
  error?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        readOnly={readOnly || !isEditing}
        className={`w-full p-3 text-sm border rounded-lg transition-all duration-300
                   ${readOnly || !isEditing ? 'bg-gray-50' : 'bg-white hover:border-blue-400'}
                   ${error ? 'border-red-300 focus:ring-red-500' : 'focus:ring-blue-500'}
                   focus:ring-2 focus:border-transparent outline-none`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function VerificationPage() {
  const router = useRouter();
  const [application, setApplication] = useState<VisaApplication | null>(null);
  const [originalData, setOriginalData] = useState<VisaApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingErrors, setEditingErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!router.isReady) return;

      try {
        setLoading(true);
        const { id } = router.query;
        
        if (!id || typeof id !== 'string') {
          throw new Error('Application ID is required');
        }

        const { data: application, error: fetchError } = await supabase
          .from('visa_applications')
          .select(`
            id,
            applicant_name,
            phone_number,
            email,
            nationality,
            destination,
            visa_type,
            passport_data,
            document_status,
            status,
            is_indian_passport,
            files,
            files_uploaded,
            total_files_required,
            created_at,
            updated_at,
            application_identifier
          `)
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!application) throw new Error('Application not found');

        if (!application.passport_data) {
          throw new Error('Passport data is missing');
        }
        
        setApplication(application);
        setOriginalData(application);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load application data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, router.query]);

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!application) return errors;

    if (!application.applicant_name?.trim()) {
      errors.applicant_name = 'Name is required';
    }
    if (!application.email?.trim()) {
      errors.email = 'Email is required';
    }

    if (application.passport_data) {
      const requiredFields = [
        'passport_number',
        'expiry_date',
        'nationality',
        'given_name',
        'family_name',
        'date_of_birth',
        'gender',
      ];

      requiredFields.forEach(field => {
        if (!application.passport_data[field]?.trim()) {
          errors[`passport_${field}`] = `${field.replace(/_/g, ' ')} is required`;
        }
      });
    }

    setEditingErrors(errors);
    return errors;
  };

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors before saving');
      return;
    }

    try {
      if (!application?.id) return;
      
      setSubmitting(true);
      const { error: updateError } = await supabase
        .from('visa_applications')
        .update({
          applicant_name: application.applicant_name,
          email: application.email,
          passport_data: application.passport_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (updateError) throw updateError;
      
      setOriginalData(application);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to save changes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setApplication(originalData);
    setIsEditing(false);
    setEditingErrors({});
    setError(null);
  };

  const handleSubmit = async () => {
    if (!application?.id) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { error: updateError } = await supabase
        .from('visa_applications')
        .update({
          status: 'pending_payment',
          document_status: 'verified',
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);

      if (updateError) throw updateError;
      
      router.push({
        pathname: '/payment',
        query: {
          id: application.id,
          phone: encodeURIComponent(application.phone_number)
        }
      });
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to proceed to payment. Please try again.');
    } finally {
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
          <button 
            onClick={() => router.push('/')} 
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
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
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:border-blue-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-red-300 text-gray-600 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Edit Details
            </button>
          )}
        </nav>

        <main className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">Verify Your Details</h1>
                <p className="text-blue-100 text-sm">Please review and confirm your information</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Personal Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <EditableField
                label="Full Name"
                value={application?.applicant_name ?? ''}
                onChange={value => setApplication(prev => 
                  prev ? { ...prev, applicant_name: value } : null
                )}
                isEditing={isEditing}
                error={editingErrors.applicant_name}
              />
              <EditableField
                label="Email"
                value={application?.email ?? ''}
                onChange={value => setApplication(prev => 
                  prev ? { ...prev, email: value } : null
                )}
                isEditing={isEditing}
                error={editingErrors.email}
                type="email"
              />
              <EditableField
                label="Phone Number"
                value={application?.phone_number ?? ''}
                readOnly={true}
              />
              <EditableField
                label="Nationality"
                value={application?.nationality ?? ''}
                readOnly={true}
              />
            </div>

            {/* Passport Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Passport Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {application?.passport_data && Object.entries(application.passport_data)
                  .filter(([key]) => !['travel_doc_type'].includes(key))
                  .map(([key, value]) => (
                    <EditableField
                      key={key}
                      label={key.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                      value={value ?? ''}
                      onChange={value => setApplication(prev => 
                        prev ? {
                          ...prev,
                          passport_data: { ...prev.passport_data, [key]: value }
                        } : null
                      )}
                      isEditing={isEditing}
                      error={editingErrors[`passport_${key}`]}
                    />
                  ))}
              </div>
            </div>

            {/* Visa Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Visa Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <EditableField
                  label="Destination"
                  value={application?.destination ?? ''}
                  readOnly={true}
                />
                <EditableField
                  label="Visa Type"
                  value={application?.visa_type ?? ''}
                  readOnly={true}
                />
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
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
        </main>

        {error && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg animate-shake">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}