export enum JobRole {
  MARKET_RESEARCH = 'Market Research',
  UI_UX = 'UI/UX Design',
  FRONTEND = 'Frontend Developer'
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  portfolio: string;
  role: JobRole;
  resume: File | null;
}

export interface AIResponse {
  text: string;
  error?: string;
}