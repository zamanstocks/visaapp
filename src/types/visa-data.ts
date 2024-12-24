// src/types/visa-data.ts

export interface PassportDetails {
  [key: string]: string;
}

export interface ContactInfo {
  phone: string;
  email?: string;
}

export interface AdditionalInfo {
  lastDepartureCountry: string;
  applyingCountry: string;
  visaType: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  nationality: string;
  destination: string;
  visaType: string;
}

export interface UploadedDocuments {
  photo: { dataUrl: string; fileName: string } | null;
  passport: { dataUrl: string; fileName: string } | null;
  extractedPassport: PassportDetails | null;
}

export interface FormDataType {
  extractedPassportDetails: PassportDetails;
  contactInfo: ContactInfo;
  additionalInfo: AdditionalInfo;
}

export interface EditingSections {
  extractedPassportDetails: boolean;
  contactInfo: boolean;
  additionalInfo: boolean;
  profile: boolean;
}
