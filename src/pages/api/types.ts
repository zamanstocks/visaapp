export interface FileInfo {
  filepath: string;
  filename: string;
  type: string;
  size: number;
  timestamp: string;
}

export interface PassportData {
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
  place_of_birth: string;
  nationality: string;
  last_departure_country?: string;
  mother_name?: string;
  father_name?: string;
  marital_status?: string;
}

export interface ProcessedData {
  passport_data: PassportData | null;
  upload_info: FileInfo & {
    fieldName: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: {
    id: string;
    processedData: ProcessedData;
  };
  error?: string;
}
