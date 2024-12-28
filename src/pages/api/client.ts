import { FileInfo, PassportData, IndianVisaApplication, PhVisaApplication } from './types';

export const visaApi = {
  async uploadFile(file: File): Promise<FileInfo> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async processPassport(image: string): Promise<PassportData> {
    const response = await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image })
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async submitIndianVisa(data: IndianVisaApplication) {
    const response = await fetch('/api/visa-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async submitPhVisa(data: PhVisaApplication) {
    const response = await fetch('/api/visa-ph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  async processPassportUpload(
    file: File,
    type: 'passport' | 'passportFront' | 'passportBack' | 'photo'
  ) {
    const fileInfo = await this.uploadFile(file);
    
    if (type === 'photo') {
      return { fileInfo };
    }

    const reader = new FileReader();
    const imageData = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const passportData = await this.processPassport(imageData);
    return { fileInfo, passportData };
  }
};
