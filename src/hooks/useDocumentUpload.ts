// src/hooks/useDocumentUpload.ts
import { useState, useEffect } from 'react';
import { Store } from '../lib/store';
import { compressImage } from '../lib/imageUtils';

interface UploadStatus {
  photo: 'waiting' | 'uploading' | 'processing' | 'success' | 'error';
  passport: 'waiting' | 'uploading' | 'processing' | 'success' | 'error';
}

interface ProcessingState {
  stage: 'uploading' | 'compressing' | 'processing' | 'saving' | 'complete';
  progress: number;
  message: string;
}

export const useDocumentUpload = (searchParams: URLSearchParams) => {
  const [formId] = useState(() => Store.generateId());
  const [status, setStatus] = useState<UploadStatus>({ photo: 'waiting', passport: 'waiting' });
  const [documents, setDocuments] = useState<{ passport: any; photo: any }>({ passport: null, photo: null });
  const [error, setError] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    stage: 'uploading',
    progress: 0,
    message: 'Preparing upload...'
  });
  const [userData, setUserData] = useState<any>(null);

  // Load initial user data
  useEffect(() => {
    if (!searchParams) return;
    const data = {
      firstName: searchParams.get('firstName'),
      phone: searchParams.get('phone'),
      email: searchParams.get('email'),
      destination: searchParams.get('destination'),
      nationality: searchParams.get('nationality'),
      visaType: searchParams.get('visaType')
    };
    setUserData(data);
    Store.setForm(formId, data);
  }, [searchParams, formId]);

  const updateProcessingState = (stage: ProcessingState['stage'], progress: number, message: string) => {
    setProcessingState({ stage, progress, message });
  };

  const handleFileUpload = async (type: 'passport' | 'photo', file: File) => {
    try {
      setStatus(prev => ({ ...prev, [type]: 'uploading' }));
      setError(null);

      // Stage 1: Compression
      updateProcessingState('compressing', 20, 'Compressing image...');
      const compressed = await compressImage(file);
      
      if (type === 'passport') {
        updateProcessingState('processing', 40, 'Processing passport data...');

        const formData = new FormData();
        formData.append('passport', file);
        formData.append('photo', new File([], 'placeholder.jpg')); // Required by API
        
        // Add user data
        Object.entries(userData).forEach(([key, value]) => {
          if (value) formData.append(key, value.toString());
        });

        updateProcessingState('processing', 60, 'Extracting information...');
        const response = await fetch('/api/process-passport', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Processing failed');
        }

        updateProcessingState('saving', 80, 'Saving results...');
        const docData = {
          dataUrl: compressed,
          fileName: file.name,
          extractedData: result.data,
          timestamp: new Date().toISOString()
        };

        // Update state and storage
        const newDocuments = {
          ...documents,
          passport: docData
        };
        
        setDocuments(newDocuments);
        Store.setDocuments(formId, newDocuments);
        setStatus(prev => ({ ...prev, passport: 'success' }));
        
        updateProcessingState('complete', 100, 'Processing complete!');

      } else {
        // Photo upload process
        updateProcessingState('saving', 80, 'Saving photo...');
        const docData = {
          dataUrl: compressed,
          fileName: file.name,
          timestamp: new Date().toISOString()
        };

        const newDocuments = {
          ...documents,
          photo: docData
        };

        setDocuments(newDocuments);
        Store.setDocuments(formId, newDocuments);
        setStatus(prev => ({ ...prev, photo: 'success' }));
        updateProcessingState('complete', 100, 'Upload complete!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      setStatus(prev => ({ ...prev, [type]: 'error' }));
      updateProcessingState('complete', 0, 'Upload failed');
    }
  };

  const handleCompletion = async () => {
    try {
      const storedDocs = Store.getDocuments(formId);
      
      if (!storedDocs?.passport || !storedDocs?.photo) {
        setError('Please upload both passport and photo');
        return;
      }

      // Verify data integrity
      if (!storedDocs.passport.extractedData) {
        setError('Passport data extraction failed. Please try again.');
        return;
      }

      // Navigate to verification
      window.location.href = `/verification?formId=${formId}`;
    } catch (error) {
      setError('Failed to proceed to verification. Please try again.');
    }
  };

  return {
    status,
    error,
    processingState,
    documents,
    handleFileUpload,
    handleCompletion,
    userData
  };
};