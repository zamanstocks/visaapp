import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
 Upload, CheckCircle, ArrowLeft, AlertCircle, Camera, 
 FileText, X, Loader2 
} from 'lucide-react';

const WhatsAppButton = () => (
 <Link
   href="https://wa.me/968782042289"
   target="_blank"
   rel="noopener noreferrer"
   className="fixed bottom-24 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50 flex items-center gap-2"
 >
   <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
   </svg>
   <span className="text-sm font-medium">Need Help?</span>
 </Link>
);

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

interface ApiResponse {
  success: boolean;
  data?: {
    id: string;
    processedData: ProcessedData;
  };
  error?: string;
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

interface UploadComponentProps {
  type: string;
  title: string;
  description: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploaded: boolean;
  isDisabled: boolean;
  isProcessing: boolean;
  processStage?: string;
  uploadError?: string;
  fileName?: string;
  onRemove?: () => void;
}

interface ExtractedDataReviewProps {
  data: ProcessedData;
  onSubmit: () => void;
  onClose: () => void;
  onUpdate: (updatedData: ProcessedData) => void;
}

const ProcessStages = [
  'Initializing upload...',
  'Reading document...',
  'Analyzing content...',
  'Extracting data...',
  'Validating information...',
  'Finalizing...'
];

const ExtractedDataReview: React.FC<ExtractedDataReviewProps> = ({ 
  data, 
  onSubmit, 
  onClose,
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (editedData.passport_data) {
      setEditedData({
        ...editedData,
        passport_data: {
          ...editedData.passport_data,
          [field]: value
        }
      });
    }
  };

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 divide-y">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Review Information</h3>
          <p className="text-sm text-gray-500">Please verify the extracted information</p>
        </div>
        
        <div className="p-6 space-y-4">
          {editedData.passport_data && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Full Name</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedData.passport_data.given_name}
                      onChange={(e) => handleInputChange('given_name', e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Given Name"
                    />
                    <input
                      type="text"
                      value={editedData.passport_data.family_name}
                      onChange={(e) => handleInputChange('family_name', e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Family Name"
                    />
                  </div>
                ) : (
                  <p className="font-medium">
                    {`${editedData.passport_data.given_name} ${editedData.passport_data.family_name}`}
                  </p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Passport Number</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.passport_data.passport_number}
                    onChange={(e) => handleInputChange('passport_number', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{editedData.passport_data.passport_number}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedData.passport_data.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{formatDate(editedData.passport_data.date_of_birth)}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Nationality</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.passport_data.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{editedData.passport_data.nationality}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedData.passport_data.issue_date}
                    onChange={(e) => handleInputChange('issue_date', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{formatDate(editedData.passport_data.issue_date)}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Expiry Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedData.passport_data.expiry_date}
                    onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="font-medium">{formatDate(editedData.passport_data.expiry_date)}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 flex gap-3 justify-end rounded-b-xl">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>Submit & Pay</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <div className={`relative border-2 border-dashed rounded-xl p-6 text-center 
                    transition duration-200 ease-in-out group
                    ${isDisabled ? 'border-gray-200 bg-gray-50' : 
                      isUploaded ? 'bg-green-50 border-green-300' : 
                      uploadError ? 'bg-red-50 border-red-300' : 
                      'border-gray-200 hover:border-blue-400'}`}>
        {isUploaded ? (
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto animate-bounce" />
            <span className="text-green-600 font-medium block">Successfully Uploaded</span>
            {fileName && (
              <span className="text-sm text-gray-500 break-all bg-green-100/50 px-2 py-1 rounded inline-block max-w-full truncate">
                {fileName}
              </span>
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
              <p className="text-sm font-medium text-gray-700">Click or drag file to upload</p>
              <p className="text-xs text-gray-500 mt-1">Supported: JPG, PNG (max 10MB)</p>
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
  const router = useRouter();
  const [uploads, setUploads] = useState<FileUploads>({});
  const [message, setMessage] = useState<string | null>(null);
  const [processingField, setProcessingField] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<string>(ProcessStages[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  const { destination, visaType, nationality, phone } = router.query;

  useEffect(() => {
    const initialUploads: FileUploads = String(nationality).toLowerCase() === 'india' 
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

  const checkCompletion = (updatedUploads: FileUploads) => {
    const allUploaded = Object.values(updatedUploads).every(upload => upload.uploaded);
    if (allUploaded && !isCompleted) {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
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
    
    if (destination) formData.append('destination', String(destination));
    if (visaType) formData.append('visaType', String(visaType));
    if (nationality) formData.append('nationality', String(nationality));
    if (phone) formData.append('phone', String(phone));

    try {
      await simulateProcess();
      const response = await fetch('/api/document-handler', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json() as ApiResponse;

      if (response.ok && result.success && result.data) {
        const updatedUploads = {
          ...uploads,
          [fieldName]: { 
            file, 
            uploaded: true,
            processedData: result.data.processedData
          }
        };
        setUploads(updatedUploads);
        setApplicationId(result.data.id);
        setProcessedData(result.data.processedData);
        if (checkCompletion(updatedUploads)) {
          setShowReview(true);
        }
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
    setShowReview(false);
  };

  const handleSubmitAndPay = () => {
    if (applicationId) {
      router.push({
        pathname: '/payment',
        query: {
          id: applicationId,
          phone: phone
        }
      });
    }
  };

  const isFieldEnabled = (fieldName: string) => {
    if (fieldName === Object.keys(uploads)[0]) return true;
    const fields = Object.keys(uploads);
    const currentIndex = fields.indexOf(fieldName);
    return currentIndex > 0 && uploads[fields[currentIndex - 1]]?.uploaded;
  };

// Add this new function here
const handleDataUpdate = (updatedData: ProcessedData) => {
  setProcessedData(updatedData);
  // Also update the relevant upload's processedData
  if (updatedData.upload_info.fieldName) {
    setUploads(prev => ({
      ...prev,
      [updatedData.upload_info.fieldName]: {
        ...prev[updatedData.upload_info.fieldName],
        processedData: updatedData
      }
    }));
  }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
    <div className="max-w-2xl mx-auto space-y-6">
      <nav className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow group"
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

      {showReview && processedData && (
        <ExtractedDataReview
          data={processedData}
          onSubmit={handleSubmitAndPay}
          onClose={() => setShowReview(false)}
          onUpdate={handleDataUpdate}
        />
      )}

      {message && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg shadow-lg">
          <AlertCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      )}
    </div>

    <WhatsAppButton />
  </div>
);
}