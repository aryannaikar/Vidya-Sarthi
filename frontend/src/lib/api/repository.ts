import { Opportunity, OpportunityFilters } from "@/types/opportunity";
import { Hackathon } from "@/types/hackathon";
import { StudentProfile } from "@/types/user";

export interface Repository {
  getOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | null>;
  getHackathons(): Promise<Hackathon[]>;
  getHackathonById(id: string): Promise<Hackathon | null>;
  getSavedOpportunities(): Promise<Opportunity[]>;
  toggleSaveOpportunity(id: string): Promise<boolean>;
  getStudentProfile(): Promise<StudentProfile>;
  updateStudentProfile(profile: Partial<StudentProfile>): Promise<StudentProfile>;
}
