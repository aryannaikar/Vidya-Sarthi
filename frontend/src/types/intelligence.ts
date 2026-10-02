export type SkillCategory =
  | "languages"
  | "frameworks"
  | "systems_cloud"
  | "databases"
  | "soft_skills";

export type SkillSource =
  | "resume"
  | "manual"
  | "portfolio_github"
  | "project_description";

export type SkillVerificationStatus = "confirmed" | "suggested" | "rejected";

export interface SkillEvidence {
  id: string;
  name: string;
  category: SkillCategory;
  sources: SkillSource[];
  status: SkillVerificationStatus;
  contextSnippet?: string;
  sourceDocument?: string;
  firstDetectedAt: string;
}

export interface EducationTimelineItem {
  id: string;
  degree: string;
  college: string;
  branch: string;
  graduationYear: number;
  isVerified: boolean;
}

export interface ExperienceTimelineItem {
  id: string;
  role: string;
  organization: string;
  type: "internship" | "full-time" | "project";
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  source: SkillSource;
  extractedTechnologies: string[];
}

export interface PortfolioRepositorySummary {
  repoName: string;
  url: string;
  description: string;
  primaryLanguage: string;
  detectedTechnologies: string[];
  starsCount?: number;
  lastUpdated?: string;
  qualityObservations?: string[];
}

export interface PortfolioAnalysisResult {
  analyzedUrl: string;
  status: "verified" | "partial" | "offline_or_private";
  lastAnalyzedAt: string;
  repositories: PortfolioRepositorySummary[];
  overallStrengths: string[];
  suggestedImprovements: string[];
}

export interface CareerGapAnalysis {
  targetRole: string;
  supportedSkills: string[];
  recommendedSkillsToAcquire: string[];
  rationale: string;
  suggestedProjectAreas: string[];
}

export interface ProfileIntelligenceData {
  studentId: string;
  fullName: string;
  headline: string;
  college: string;
  email: string;
  analysisVersion: string;
  lastAnalyzedAt: string;
  completenessPercentage: number;
  completenessChecklist: {
    label: string;
    completed: boolean;
    importance: "required" | "recommended";
  }[];
  skills: SkillEvidence[];
  education: EducationTimelineItem[];
  experience: ExperienceTimelineItem[];
  portfolio?: PortfolioAnalysisResult;
  careerGaps: CareerGapAnalysis[];
  resumeMetadata?: {
    fileName: string;
    fileSizeBytes: number;
    parsedAt: string;
    confidenceTier: "high" | "medium" | "provisional";
    confidenceExplanation: string;
    rawSnippet: string;
  };
}
