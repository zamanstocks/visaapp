import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, CheckCircle, RefreshCw, Shield, Zap, Sparkles, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useDocumentUpload } from '../hooks/useDocumentUpload';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  visaType: string;
  nationality: string;
  destination: string;
}

export default function Form() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    status, 
    error, 
    progress, 
    documents, 
    handleFileUpload, 
    handleCompletion, 
    userData 
  } = useDocumentUpload(searchParams);

  const [isProcessingPassport, setIsProcessingPassport] = useState(false);
  const [isPhotoEnabled, setIsPhotoEnabled] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [isIndian, setIsIndian] = useState(false);

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Check if nationality is Indian
  if (!isIndian && userData.nationality === 'India') {
    setIsIndian(true);
  }

  const renderPassportUpload = () => {
    const steps = isIndian ? ['front', 'back'] : ['passport'];
    return steps.map((type, index) => (
      <div key={type} className={`bg-white rounded-xl shadow-sm p-6 ${index > 0 && !documents[steps[index - 1]] ? 'opacity-50 pointer-events-none' : ''}`}>
        <h3 className="text-lg font-medium">{`Passport ${type.charAt(0).toUpperCase() + type.slice(1)}`}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {type === 'front' ? 'Upload the front side of your passport' : type === 'back' ? 'Upload the back side of your passport' : 'Upload a clear scan or photo of your passport'}
        </p>
        <label className="block mt-4">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setIsProcessingPassport(true);
                handleFileUpload(type as 'passport' | 'photo', file)
                  .then(() => {
                    if (type === steps[steps.length - 1]) {
                      setIsPhotoEnabled(true);
                    }
                  })
                  .finally(() => setIsProcessingPassport(false));
              }
            }}
          />
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition duration-200 ease-in-out ${
              documents[type] ? 'bg-green-50 border-green-300' : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            {documents[type] ? (
              <div className="space-y-4">
                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                <span className="text-green-600 font-medium">Uploaded successfully</span>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                <p className="text-sm font-medium text-gray-700">{`Drop your Passport ${type.charAt(0).toUpperCase() + type.slice(1)} here or click to browse`}</p>
              </div>
            )}
          </div>
        </label>
      </div>
    ));
  };

  const renderPhotoUpload = () => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${!isPhotoEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h3 className="text-lg font-medium">Recent Photo</h3>
      <p className="text-sm text-gray-500 mt-1">Upload a recent passport-style photo</p>
      <label className="block mt-4">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload('photo', file).then(() => setIsProcessingComplete(true));
            }
          }}
        />
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition duration-200 ease-in-out ${
            documents.photo ? 'bg-green-50 border-green-300' : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          {documents.photo ? (
            <div className="space-y-4">
              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
              <span className="text-green-600 font-medium">Uploaded successfully</span>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-10 w-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">Drop your photo here or click to browse</p>
            </div>
          )}
        </div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="bg-blue-50 rounded-lg p-4">
          <h2 className="font-medium text-blue-900">
            {userData.firstName} {userData.lastName}
          </h2>
          <p className="text-sm text-blue-700">{userData.phone}</p>
          <p className="text-sm text-blue-700">{userData.nationality} → {userData.destination}</p>
        </div>

        {renderPassportUpload()}
        {renderPhotoUpload()}

        {isProcessingComplete && (
          <button
            onClick={handleCompletion}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Continue to Verification
          </button>
        )}

        <div className="text-center">
          <Shield className="h-5 w-5 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Secured with bank-grade encryption</p>
        </div>
      </div>
    </div>
  );
}
