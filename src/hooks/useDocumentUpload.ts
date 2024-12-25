import { useState } from 'react';

interface Status {
  passport: 'idle' | 'uploading' | 'uploaded' | 'processing' | 'error';
  photo: 'idle' | 'uploading' | 'uploaded' | 'processing' | 'error';
}

interface Documents {
  passport: string;
  photo: string;
}

interface ProcessingState {
  message: string;
  progress: number;
}

export const useDocumentUpload = () => {
  const [status, setStatus] = useState<Status>({ passport: 'idle', photo: 'idle' });
  const [documents, setDocuments] = useState<Documents>({ passport: '', photo: '' });
  const [processingState, setProcessingState] = useState<ProcessingState>({ message: '', progress: 0 });
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (type: 'passport' | 'photo', file: File) => {
    try {
      // Set status to uploading
      setStatus((prev) => ({ ...prev, [type]: 'uploading' }));
      setProcessingState({ message: `Uploading ${type}...`, progress: 50 });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${type}`);
      }

      const data = await response.json();

      // Update the documents and status
      setDocuments((prev) => ({ ...prev, [type]: data.files[0].name }));
      setStatus((prev) => ({ ...prev, [type]: 'uploaded' }));
      setProcessingState({ message: `${type} uploaded successfully`, progress: 100 });

      // Reset progress after a delay
      setTimeout(() => setProcessingState({ message: '', progress: 0 }), 3000);
    } catch (err: any) {
      setError(err.message || `Error uploading ${type}`);
      setStatus((prev) => ({ ...prev, [type]: 'error' }));
    }
  };

  const handleCompletion = () => {
    if (status.passport === 'uploaded' && status.photo === 'uploaded') {
      alert('Files processed successfully! Proceeding to verification...');
      // Add navigation or further steps here
    } else {
      alert('Please upload both files before proceeding.');
    }
  };

  return {
    status,
    documents,
    processingState,
    error,
    handleFileUpload,
    handleCompletion,
  };
};
