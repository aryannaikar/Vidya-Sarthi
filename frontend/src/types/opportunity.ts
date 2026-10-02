export type OpportunityType =
  | "job"
  | "internship"
  | "hackathon"
  | "competition"
  | "mentorship_fellowship";

export type WorkMode = "remote" | "hybrid" | "in-office";

export type OpportunityStatus =
  | "published"
  | "pending_review"
  | "flagged_duplicate"
  | "archived"
  | "rejected"
  | "expired";

export type OpportunitySource =
  | "remotive_feed"
  | "unstop_public"
  | "devpost_public"
  | "employer_direct"
  | "career_portal";

export type ExperienceLevel = "fresher" | "entry_level" | "student" | "mid";

export interface Opportunity {
  id: string;
  title: string;
  company: string; // Synonymous with organization for backward compatibility
  organization?: string;
  companyLogoUrl?: string;
  type: OpportunityType;
  location: string;
  workMode: WorkMode;
  stipendOrSalary: string;
  deadline: string; // ISO date string
  daysRemaining?: number;
  originalPostingUrl: string;
  originalApplicationUrl?: string;
  canonicalUrl?: string;
  postedAt: string;
  collectedAt?: string;
  officialSource?: OpportunitySource | string;
  sourceRecordId?: string;
  status?: OpportunityStatus;
  tags: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  descriptionSnippet: string;
  description?: string;
  eligibility?: string;
  experienceLevel?: ExperienceLevel;
  validationErrors?: string[];
  duplicateOfId?: string;
  similarityScore?: number;
  ingestionBatchId?: string;
  isSaved?: boolean;
}

export interface OpportunityFilters {
  searchQuery?: string;
  type?: "all" | OpportunityType;
  workMode?: "all" | WorkMode;
  location?: string;
  tag?: string;
  status?: "all" | OpportunityStatus;
  source?: "all" | string;
}

export interface IngestionSourceSummary {
  sourceId: string;
  name: string;
  provider: string;
  type: OpportunityType | "multi";
  status: "active" | "healthy" | "rate_limited" | "error";
  lastSync: string;
  recordsFetched: number;
  recordsPublished: number;
  complianceNotes: string;
  rateLimitInfo: string;
}

export interface IngestionRunMetrics {
  totalIndexed: number;
  publishedCount: number;
  pendingReviewCount: number;
  flaggedDuplicatesCount: number;
  validationFailuresCount: number;
  lastRunTimestamp: string;
  activeSourcesCount: number;
  isIngesting?: boolean;
}

export interface IngestionRunResult {
  batchId: string;
  runAt: string;
  totalCollected: number;
  newPublished: number;
  duplicatesCaught: number;
  validationErrors: number;
  durationMs: number;
  sourceSummaries: IngestionSourceSummary[];
}
