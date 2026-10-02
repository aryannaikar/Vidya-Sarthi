import { Repository } from "./repository";
import { Opportunity, OpportunityFilters } from "@/types/opportunity";
import { Hackathon } from "@/types/hackathon";
import { StudentProfile } from "@/types/user";
import { mockOpportunities, mockHackathons, mockStudent } from "./mockData";

class MockRepository implements Repository {
  private opportunities: Opportunity[] = [...mockOpportunities];
  private hackathons: Hackathon[] = [...mockHackathons];
  private student: StudentProfile = { ...mockStudent };

  async getOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]> {
    let result = [...this.opportunities];

    if (!filters) return result;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(q) ||
          opp.company.toLowerCase().includes(q) ||
          opp.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== "all") {
      result = result.filter((opp) => opp.type === filters.type);
    }

    if (filters.workMode && filters.workMode !== "all") {
      result = result.filter((opp) => opp.workMode === filters.workMode);
    }

    return result;
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const found = this.opportunities.find((o) => o.id === id);
    return found ? { ...found } : null;
  }

  async getHackathons(): Promise<Hackathon[]> {
    return [...this.hackathons];
  }

  async getHackathonById(id: string): Promise<Hackathon | null> {
    const found = this.hackathons.find((h) => h.id === id);
    return found ? { ...found } : null;
  }

  async getSavedOpportunities(): Promise<Opportunity[]> {
    return this.opportunities.filter((o) => o.isSaved);
  }

  async toggleSaveOpportunity(id: string): Promise<boolean> {
    const opp = this.opportunities.find((o) => o.id === id);
    if (!opp) return false;
    opp.isSaved = !opp.isSaved;
    return opp.isSaved;
  }

  async getStudentProfile(): Promise<StudentProfile> {
    return { ...this.student };
  }

  async updateStudentProfile(
    updates: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    this.student = { ...this.student, ...updates };
    return { ...this.student };
  }
}

export const mockRepository = new MockRepository();
