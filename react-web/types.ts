export enum CloudProvider {
  AWS = 'AWS',
  Azure = 'Azure',
  GCP = 'GCP'
}

export enum Level {
  Fundamental = 'Fundamental',
  Associate = 'Associate',
  Professional = 'Professional',
  Specialty = 'Specialty',
  Expert = 'Expert'
}

export enum Difficulty {
    Beginner = 'Beginner',
    Intermediate = 'Intermediate',
    Advanced = 'Advanced',
}

export interface Resources {
  udemy?: string[];
  coursera?: string[];
  youtube?: string[];
}

export interface Certification {
  id: string;
  name: string;
  examCode: string;
  provider: CloudProvider;
  level: Level;
  description: string;
  focusAreas: string[];
  prerequisites: string[]; // Array of certification IDs
  leadsTo: string[]; // Array of certification IDs
  cost: number;
  duration: number; // study hours
  difficulty: Difficulty;
  passScore: number; // percentage
  validity: number; // in years
  officialLink: string;
  resources: Resources;
}

// FIX: Add ComparisonData interface for comparison modal
export interface ComparisonData {
  id: string; // certification ID
  targetAudience: string;
  careerBenefit: string;
  jobMarketBenefit: string;
  estimatedCost: string; // e.g., "$150 USD, plus training"
  officialLink: string;
}