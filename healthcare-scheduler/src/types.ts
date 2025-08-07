// Raw API response types (from JSONPlaceholder)
export interface RawUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface RawPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Our processed data types
export interface HealthcareWorker {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: 'Nurse' | 'Doctor' | 'Tech' | 'Other';
  certificationCount: number;
  availability: 'available' | 'busy' | 'unavailable';
  hourlyRate: number;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Specialty mapping type
export type SpecialtyKeywords = {
  [key: string]: 'Nurse' | 'Doctor' | 'Tech' | 'Other';
};