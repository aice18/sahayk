export interface UserProfile {
  uid: string;
  fullName: string;
  age: number;
  income: string;
  occupation: string;
  language: string;
  location: string;
  role: 'user' | 'admin';
}

export interface Scheme {
  id: string;
  title: string;
  titleKey?: string;
  description: string;
  descriptionKey?: string;
  category: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  imageUrl?: string;
  status?: 'active' | 'completed' | 'pending' | 'rejected';
}

export interface Application {
  id: string;
  schemeId: string;
  userId: string;
  status: 'submitted' | 'verification' | 'site_visit' | 'sanction' | 'approved' | 'rejected';
  submittedAt: string;
  estimatedCompletion?: string;
  trackingId: string;
  remarks?: string;
}
