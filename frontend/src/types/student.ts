export type OpportunityType = "job" | "internship";
export type WorkMode = "remote" | "hybrid" | "in-office";
export type AcademicYear = "1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "Final Year" | "Postgraduate";

export interface EducationEntry {
  id: string;
  college: string;
  degree: string;
  branch: string;
  academicYear: AcademicYear;
  graduationYear: number;
  cgpaOrPercentage?: string;
}

export interface CareerPreferences {
  desiredRoles: string[];
  careerInterests: string[];
  preferredIndustries: string[];
  preferredLocations: string[];
  workModePreference: "any" | WorkMode;
  opportunityTypePreference: "all" | OpportunityType;
  shortTermGoals: string;
}

export interface WorkExperienceEntry {
  id: string;
  role: string;
  company: string;
  location?: string;
  isCurrent: boolean;
  startDate: string;
  endDate?: string;
  description: string;
  type: "internship" | "full-time" | "part-time" | "freelance";
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  repoUrl?: string;
  liveUrl?: string;
}

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface PortfolioLinks {
  personalWebsite?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  otherLinks?: string[];
}

export interface ExtractedResumeData {
  fileName: string;
  fileSizeBytes: number;
  extractedTextPreview?: string;
  skillsDetected: string[];
  educationDetected?: {
    college?: string;
    degree?: string;
    graduationYear?: number;
  };
  contactDetected?: {
    email?: string;
    phone?: string;
  };
  parsedAt: string;
  confidenceScore?: number;
}

export interface CompleteStudentProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  headline?: string;
  education: EducationEntry;
  preferences: CareerPreferences;
  technicalSkills: string[];
  softSkills: string[];
  programmingLanguages: string[];
  toolsAndFrameworks: string[];
  workExperience: WorkExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  portfolio: PortfolioLinks;
  resume?: ExtractedResumeData;
  hasCompletedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
}
