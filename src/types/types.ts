// types.ts

// Base interfaces for visa-related data
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

// Component-specific interfaces
export interface DropdownOptionProps {
  flag: string;
  name: string;
  subtitle?: string;
  onClick: () => void;
}

export interface Stats {
  value: string;
  label: string;
  description: string;
}

// API and state management interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ApplicationState {
  destinations: Destination[];
  nationalities: Nationality[];
  requirements: { [key: string]: VisaRequirements };
  loading: boolean;
  error: string | null;
  selectedDestination: Destination | null;
  selectedNationality: Nationality | null;
  selectedVisaType: VisaType | null;
  searchTerm: string;
}

// Props interfaces for child components
export interface VisaCardProps {
  visaType: VisaType;
  destination: Destination;
  onSelect: (visaType: VisaType) => void;
}

// Navigation and layout interfaces
export interface NavigationProps {
  router: any;
  showBackButton?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}