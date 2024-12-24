import { useState, useEffect } from 'react';
import { Store } from '../lib/store';
import { compressImage } from '../lib/imageUtils';

export const useDocumentUpload = (searchParams: URLSearchParams) => {
  const [formId] = useState(() => Store.generateId());
  const [status, setStatus] = useState({ photo: 'waiting', passport: 'waiting' });
  const [documents, setDocuments] = useState({ passport: null, photo: null });
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState(null);

  // Load initial user data
  useEffect(() => {
    if (!searchParams) return;
    const data = {
      firstName: searchParams.get('firstName'),
      lastName: searchParams.get('lastName'),
      phone: searchParams.get('phone'),
      email: searchParams.get('email'),
      destination: searchParams.get('destination'),
      nationality: searchParams.get('nationality'),
      visaType: searchParams.get('visaType')
    };
    setUserData(data);
    Store.setForm(formId, data);
  }, [searchParams, formId]);

  const handleFileUpload = async (type, file) => {
    try {
      setStatus(prev => ({ ...prev, [type]: 'uploading' }));
      
      const compressed = await compressImage(file);
      
      if (type === 'passport') {
        setIsScanning(true);
        setProgress(20);

        const formData = new FormData();
        formData.append('passport', file);

        const response = await fetch('/api/process-passport', {
          method: 'POST',
          body: formData
        });

        setProgress(60);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Processing failed');
        }

        const docData = {
          dataUrl: compressed,
          fileName: file.name,
          extractedData: result.data
        };

        // Update state and storage atomically
        const newDocuments = {
          ...documents,
          passport: docData
        };
        
        setDocuments(newDocuments);
        Store.setDocuments(formId, newDocuments);
        setStatus(prev => ({ ...prev, passport: 'success' }));
        setProgress(100);
        
        console.log('Passport processed:', {
          docData,
          storedDocuments: Store.getDocuments(formId)
        });

      } else {
        const docData = {
          dataUrl: compressed,
          fileName: file.name
        };

        const newDocuments = {
          ...documents,
          photo: docData
        };

        setDocuments(newDocuments);
        Store.setDocuments(formId, newDocuments);
        setStatus(prev => ({ ...prev, photo: 'success' }));
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      setStatus(prev => ({ ...prev, [type]: 'error' }));
    } finally {
      setIsScanning(false);
      setProgress(0);
    }
  };

  const handleCompletion = () => {
    const storedDocs = Store.getDocuments(formId);
    console.log('Completing with docs:', storedDocs);

    if (!storedDocs?.passport || !storedDocs?.photo) {
      setError('Please upload both documents');
      return;
    }

    window.location.href = `/verification?formId=${formId}`;
  };

  return {
    status,
    error,
    isScanning,
    progress,
    documents,
    handleFileUpload,
    handleCompletion,
    userData
  };
};
