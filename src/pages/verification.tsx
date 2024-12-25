// pages/verification.tsx
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

type PassportData = {
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
  nationality: string;
  address: string;
  [key: string]: string;
};

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [extractedData, setExtractedData] = useState<PassportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const firstName = searchParams.get('firstName') || 'Unknown';
  const phone = searchParams.get('phone') || 'N/A';
  const destination = searchParams.get('destination') || 'Unknown';
  const nationality = searchParams.get('nationality') || 'Unknown';
  const visaType = searchParams.get('visaType') || 'Unknown';
  const passportDataString = searchParams.get('passportData');

  useEffect(() => {
    if (passportDataString) {
      try {
        const decoded = decodeURIComponent(passportDataString);
        const data = JSON.parse(decoded);
        setExtractedData(data);
      } catch (err) {
        setError('Failed to load passport data');
      }
    }
  }, [passportDataString]);

  const DataField = ({ label, value }: { label: string; value: string }) => (
    <div className="border-b border-gray-100 py-3">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{value || 'Not Available'}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 
                   backdrop-blur border border-gray-200 hover:border-blue-300 
                   transition-all shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Document Verification
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review extracted information for accuracy
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Documents Uploaded</span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="font-medium text-blue-900">{firstName} ({phone})</h2>
            <p className="text-sm text-blue-700 mt-1">
              {nationality} → {destination}
            </p>
            <p className="text-xs text-gray-500 mt-1">{visaType}</p>
          </div>

          {error ? (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : extractedData ? (
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 mb-4">Extracted Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(extractedData).map(([key, value]) => (
                  value && key !== 'travel_doc_type' && (
                    <DataField
                      key={key}
                      label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      value={value}
                    />
                  )
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Loading extracted data...
            </div>
          )}
        </div>

        <button
          onClick={() => router.push('/success')}
          disabled={!!error}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white 
                   rounded-xl font-medium shadow-lg shadow-green-500/20
                   hover:shadow-xl hover:shadow-green-500/40 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all transform hover:scale-[1.01]"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
}