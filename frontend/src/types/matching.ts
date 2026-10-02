import { Opportunity } from "@/types/opportunity";

export type RelevanceTier = "exceptional" | "strong" | "moderate";

export type EligibilityStatus =
  | "confirmed_eligible"
  | "likely_eligible"
  | "unconfirmed";

export interface MatchedOpportunity {
  opportunity: Opportunity;
  relevanceScore: number; // 0 to 100
  relevanceTier: RelevanceTier;
  eligibilityStatus: EligibilityStatus;
  eligibilityNotes: string;
  matchRationale: string;
  matchedSkills: string[];
  missingSkills: string[];
  interestAlignment: string;
  workModeAlignment: string;
  suggestedAction: string;
}

export interface StudentMatchingContext {
  studentId: string;
  fullName: string;
  degree?: string;
  college?: string;
  graduatingYear?: number;
  skills: string[];
  targetRoles: string[];
  preferredLocations: string[];
  preferredWorkModes: string[];
  opportunityTypePreference?: "all" | "job" | "internship" | "hackathon" | "competition" | "mentorship_fellowship";
}

export interface MatchingFilterOptions {
  type?: "all" | string;
  minScore?: number;
  eligibilityOnly?: boolean;
  searchQuery?: string;
}

export interface MatchingRecommendationResponse {
  success: boolean;
  totalMatches: number;
  studentContext: StudentMatchingContext;
  matches: MatchedOpportunity[];
  calculatedAt: string;
}
