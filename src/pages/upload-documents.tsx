import { useSearchParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState, useEffect } from 'react';
import { Upload, CheckCircle, ArrowLeft, AlertCircle, Camera, FileText, X } from 'lucide-react';

interface UploadComponentProps {
  type: string;
  title: string;
  description: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  isUploaded: boolean;
  isDisabled: boolean;
  isProcessing: boolean;
  uploadError?: string;
  fileName?: string;
  onRemove?: () => void;
}

interface FileUpload {
  file: File | null;
  uploaded: boolean;
  error?: string;
}

interface FileUploads {
  [key: string]: FileUpload;
}

const DocumentUpload = ({
  type,
  title,
  description,
  onUpload,
  isUploaded,
  isDisabled,
  isProcessing,
  uploadError,
  fileName,
  onRemove
}: UploadComponentProps) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        {type.toLowerCase().includes('photo') ? (
          <Camera className="w-6 h-6 text-blue-500" />
        ) : (
          <FileText className="w-6 h-6 text-blue-500" />
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {isUploaded && onRemove && (
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <label className="block mt-4">
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
        onChange={onUpload}
        disabled={isDisabled || isProcessing}
      />
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer 
                    transition duration-200 ease-in-out group hover:border-blue-400
                    ${isUploaded ? 'bg-green-50 border-green-300' : 
                      uploadError ? 'bg-red-50 border-red-300' : 
                      'border-gray-200'}`}
      >
        {isUploaded ? (
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
            <span className="text-green-600 font-medium block">Successfully Uploaded</span>
            {fileName && (
              <span className="text-sm text-gray-500 break-all">{fileName}</span>
            )}
          </div>
        ) : isProcessing ? (
          <div className="space-y-2">
            <div className="animate-spin h-8 w-8 border-3 border-blue-500 rounded-full border-t-transparent mx-auto" />
            <span className="text-blue-600 font-medium block">Uploading...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click or drag file to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported: JPG, PNG, PDF (max 10MB)
              </p>
            </div>
            {uploadError && (
              <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded">
                {uploadError}
              </p>
            )}
          </div>
        )}
      </div>
    </label>
  </div>
);

export default function DocumentUploadForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [uploads, setUploads] = useState<FileUploads>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const nationality = searchParams.get('nationality') || 'Unknown';
  const firstName = searchParams.get('firstName') || 'Unknown';
  const phone = searchParams.get('phone') || 'N/A';
  const destination = searchParams.get('destination') || 'Unknown';
  const visaType = searchParams.get('visaType') || 'Unknown';

  useEffect(() => {
    const initialUploads: FileUploads = nationality.toLowerCase() === 'india' 
      ? {
          passportFront: { file: null, uploaded: false },
          passportLastPage: { file: null, uploaded: false },
          photo: { file: null, uploaded: false }
        }
      : {
          passport: { file: null, uploaded: false },
          photo: { file: null, uploaded: false }
        };
    setUploads(initialUploads);
  }, [nationality]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploads(prev => ({
        ...prev,
        [fieldName]: { file: null, uploaded: false, error: 'File size must be less than 10MB' }
      }));
      return;
    }

    setUploads(prev => ({
      ...prev,
      [fieldName]: { file, uploaded: false }
    }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldName', fieldName);
    formData.append('firstName', firstName);
    formData.append('nationality', nationality);
    formData.append('phone', phone);

    try {
      const response = await fetch('/api/document-handler', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploads(prev => ({
          ...prev,
          [fieldName]: { file, uploaded: true }
        }));
        setMessage(null);
      } else {
        const error = await response.text();
        setUploads(prev => ({
          ...prev,
          [fieldName]: { file: null, uploaded: false, error }
        }));
      }
    } catch (error) {
      setUploads(prev => ({
        ...prev,
        [fieldName]: { file: null, uploaded: false, error: 'Upload failed' }
      }));
    }
  };

  const handleRemoveFile = (fieldName: string) => {
    setUploads(prev => ({
      ...prev,
      [fieldName]: { file: null, uploaded: false }
    }));
  };

  const handleSubmit = () => {
    const allFilesUploaded = Object.values(uploads).every(upload => upload.uploaded);
    if (!allFilesUploaded) {
      setMessage('Please upload all required documents');
      return;
    }
    router.push('/verification');
  };
  const getUploadDescription = (fieldName: string): string => {
    switch (fieldName) {
      case 'passportFront':
        return 'Upload the first/photo page of your passport clearly';
      case 'passportLastPage':
        return 'Upload the last page containing address and other details';
      case 'passport':
        return 'Upload clear scans of all relevant passport pages';
      case 'photo':
        return 'Recent passport photo with white background (35x45mm)';
      default:
        return `Upload your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <nav className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 
                     backdrop-blur border border-gray-200 hover:border-blue-300 
                     transition-all shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </nav>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-medium text-xl text-blue-900 mb-2">
            {firstName} ({phone})
          </h2>
          <p className="text-sm text-blue-700">
            {nationality} → {destination}
          </p>
          <p className="text-xs text-gray-500 mt-1">{visaType}</p>
        </div>

        <div className="space-y-4">
          {Object.entries(uploads).map(([fieldName, upload]) => (
            <DocumentUpload
              key={fieldName}
              type={fieldName}
              title={fieldName.replace(/([A-Z])/g, ' $1').trim()}
              description={getUploadDescription(fieldName)}
              onUpload={(e) => handleFileUpload(e, fieldName)}
              isUploaded={upload.uploaded}
              isDisabled={isProcessing}
              isProcessing={false}
              uploadError={upload.error}
              fileName={upload.file?.name}
              onRemove={() => handleRemoveFile(fieldName)}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isProcessing || !Object.values(uploads).every(upload => upload.uploaded)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                   rounded-xl font-medium shadow-lg shadow-blue-500/20
                   hover:shadow-xl hover:shadow-blue-500/40 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all transform hover:scale-[1.01]"
        >
          {isProcessing ? 'Processing...' : 'Submit Application'}
        </button>

        {message && (
          <div className="animate-bounce flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}