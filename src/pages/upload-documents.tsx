import { useSearchParams, useRouter } from 'next/navigation';
import { ChangeEvent, useState, useEffect } from 'react';
import { Upload, CheckCircle, ArrowLeft, AlertCircle, Camera, FileText, X, Loader2 } from 'lucide-react';

interface ProcessedData {
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
  } | null;
  upload_info: {
    fieldName: string;
    filename: string;
    filepath: string;
    size: number;
    type: string;
    timestamp: string;
  };
}

interface UploadComponentProps {
  type: string;
  title: string;
  description: string;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  isUploaded: boolean;
  isDisabled: boolean;
  isProcessing: boolean;
  processStage?: string;
  uploadError?: string;
  fileName?: string;
  onRemove?: () => void;
}

interface FileUpload {
  file: File | null;
  uploaded: boolean;
  error?: string;
  processedData?: ProcessedData;
}

interface FileUploads {
  [key: string]: FileUpload;
}

const ProcessStages = [
  'Initializing upload...',
  'Reading document...',
  'Analyzing content...',
  'Extracting data...',
  'Validating information...',
  'Finalizing...'
];

const DocumentUpload: React.FC<UploadComponentProps> = ({
  type,
  title,
  description,
  onUpload,
  isUploaded,
  isDisabled,
  isProcessing,
  processStage,
  uploadError,
  fileName,
  onRemove
}) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-300
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}>
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
      {isUploaded && onRemove && !isDisabled && (
        <button 
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>

    <label className={`block mt-4 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/png"
        onChange={onUpload}
        disabled={isDisabled || isProcessing}
      />
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center 
                    transition duration-200 ease-in-out group
                    ${isDisabled ? 'border-gray-200 bg-gray-50' : 
                      isUploaded ? 'bg-green-50 border-green-300' : 
                      uploadError ? 'bg-red-50 border-red-300' : 
                      'border-gray-200 hover:border-blue-400'}`}
      >
        {isUploaded ? (
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto animate-bounce" />
            <span className="text-green-600 font-medium block">Successfully Uploaded</span>
            {fileName && (
              <span className="text-sm text-gray-500 break-all bg-green-100/50 px-2 py-1 rounded inline-block max-w-full truncate">{fileName}</span>
            )}
          </div>
        ) : isProcessing ? (
          <div className="space-y-3">
            <Loader2 className="h-8 w-8 text-blue-500 mx-auto animate-spin" />
            <span className="text-blue-600 font-medium block">{processStage}</span>
            <div className="w-full bg-blue-100 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full animate-progress"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-blue-500 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click or drag file to upload
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported: JPG, PNG (max 10MB)
              </p>
            </div>
            {uploadError && (
              <div className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded flex items-center gap-2 justify-center animate-shake">
                <AlertCircle className="w-4 h-4" />
                <p>{uploadError}</p>
              </div>
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
  const [processingField, setProcessingField] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<string>(ProcessStages[0]);
  const [isCompleted, setIsCompleted] = useState(false);

  const destination = searchParams.get('destination')?.toUpperCase() || '';
  const visaType = searchParams.get('visaType') || '';
  const nationality = searchParams.get('nationality')?.toUpperCase() || '';
  const phone = searchParams.get('phone') || '';

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

  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        router.push(`/verification?phone=${encodeURIComponent(phone)}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, router, phone]);

  const checkCompletion = (updatedUploads: FileUploads) => {
    const allUploaded = Object.values(updatedUploads).every(upload => upload.uploaded);
    if (allUploaded) {
      setIsCompleted(true);
    }
    return allUploaded;
  };

  const simulateProcess = async () => {
    for (const stage of ProcessStages) {
      setCurrentStage(stage);
      await new Promise(r => setTimeout(r, 700));
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploads(prev => ({
        ...prev,
        [fieldName]: { file: null, uploaded: false, error: 'File size must be less than 10MB' }
      }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploads(prev => ({
        ...prev,
        [fieldName]: { file: null, uploaded: false, error: 'Only image files are allowed' }
      }));
      return;
    }

    setProcessingField(fieldName);
    setUploads(prev => ({
      ...prev,
      [fieldName]: { file, uploaded: false }
    }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fieldName', fieldName);
    
    searchParams.forEach((value, key) => {
      if (value) formData.append(key, value);
    });

    try {
      await simulateProcess();
      const response = await fetch('/api/document-handler', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const updatedUploads = {
          ...uploads,
          [fieldName]: { 
            file, 
            uploaded: true,
            processedData: result.data
          }
        };
        setUploads(updatedUploads);
        checkCompletion(updatedUploads);
        setMessage(null);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploads(prev => ({
        ...prev,
        [fieldName]: { 
          file: null, 
          uploaded: false, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        }
      }));
    } finally {
      setProcessingField(null);
      setCurrentStage(ProcessStages[0]);
    }
  };

  const handleRemoveFile = (fieldName: string) => {
    setUploads(prev => ({
      ...prev,
      [fieldName]: { file: null, uploaded: false }
    }));
    setIsCompleted(false);
  };

  const isFieldEnabled = (fieldName: string) => {
    if (fieldName === Object.keys(uploads)[0]) return true;
    const fields = Object.keys(uploads);
    const currentIndex = fields.indexOf(fieldName);
    return currentIndex > 0 && uploads[fields[currentIndex - 1]]?.uploaded;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <nav className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 
                     backdrop-blur border border-gray-200 hover:border-blue-300 
                     transition-all shadow-sm hover:shadow group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
        </nav>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-blue-600 font-medium">{destination}</span>
            <span>•</span>
            <span className="font-medium">{visaType}</span>
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(uploads).map(([fieldName, upload]) => (
            <DocumentUpload
              key={fieldName}
              type={fieldName}
              title={fieldName.replace(/([A-Z])/g, ' $1').trim()}
              description={upload.uploaded ? 'Document verified and processed' : `Upload your ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              onUpload={(e) => handleFileUpload(e, fieldName)}
              isUploaded={upload.uploaded}
              isDisabled={!isFieldEnabled(fieldName)}
              isProcessing={processingField === fieldName}
              processStage={currentStage}
              uploadError={upload.error}
              fileName={upload.file?.name}
              onRemove={() => handleRemoveFile(fieldName)}
            />
          ))}
        </div>

        {isCompleted && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-4 space-y-4">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Processing Complete</h3>
                <p className="text-sm text-gray-500 mt-1">Redirecting to verification...</p>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg animate-shake">
            <AlertCircle className="w-5 h-5" />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}