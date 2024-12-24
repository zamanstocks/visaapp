// types.ts
export interface VisaType {
  id: number;
  name: string;
  processingTime: string;  // Used in destination cards to show processing time
  cost: string;
  features: string[];
}

export interface Destination {
  id: number;
  name: string;
  flag: string;        // Used in destination dropdown to show country flag
  visaTypes: VisaType[];  // Array of visa types, first one used for preview
  accuracyIndex: number;  // Used for displaying data accuracy
  approvalRate: number;   // Used for showing visa approval chances
  requirements: string[]; // List of basic requirements
}

export interface Nationality {
  id: number;
  name: string;
  flag: string;  // Used in nationality dropdown to show flag
  eligibleDestinations: number[];  // Array of destination IDs this nationality can apply to
}

export interface VisaRequirements {
  standard: string[];      // Standard requirements for all applicants
  additional: string[];    // Additional requirements based on specific cases
  processing_times: {      // Processing times for different service levels
    [key: string]: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;           // Role/title of the testimonial giver
  content: string;        // The testimonial text
  rating: number;         // Rating given by the user (likely out of 5)
  avatar: string;         // Avatar/photo of the testimonial giver
}