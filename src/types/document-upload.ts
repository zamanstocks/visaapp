// src/types/document-upload.ts

export interface PassportData {
  passport_number: string;
  given_name: string;
  family_name: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  issue_date: string;
  expiry_date: string;
  place_of_issue: string;
}

export interface UserDetails {
  name: string;
  phone: string;
  email: string;
  destination: string;
  destinationId: string;
  nationality: string;
  nationalityId: string;
  visaType: string;
  visaId: string;
  visaDuration: string;
  processingTime: string;
  visaPrice: string;
}

export interface VerificationData {
  name: string;
  phone: string;
  email: string;
  destinationName: string;
  destinationId: string;
  nationalityName: string;
  nationalityId: string;
  visaName: string;
  visaId: string;
  visaDuration: string;
  processingTime: string;
  visaPrice: string;
  photoId: string;
  passportId: string;
  passportNumber?: string;
  passportDetails?: PassportData;
  photoUrl?: string;
}

export interface PhotoData {
  dataUrl: string;
  uniqueId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export type DocumentUploadStatus = 'waiting' | 'uploading' | 'success' | 'error';
