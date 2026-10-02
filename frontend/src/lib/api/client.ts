import { Repository } from "./repository";
import { mockRepository } from "./mockRepository";
import { Opportunity, OpportunityFilters } from "@/types/opportunity";
import { Hackathon } from "@/types/hackathon";
import { StudentProfile } from "@/types/user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiClient implements Repository {
  private useMockFallback: boolean = true;

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!res.ok) {
        throw new Error(`API Error [${res.status}]: ${res.statusText}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      if (this.useMockFallback) {
        console.info(`[ApiClient] Live API unreachable at ${url}, falling back to mock fixtures.`);
        throw err;
      }
      throw err;
    }
  }

  async getOpportunities(filters?: OpportunityFilters): Promise<Opportunity[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.searchQuery) params.append("q", filters.searchQuery);
      if (filters?.type && filters.type !== "all") params.append("type", filters.type);
      if (filters?.workMode && filters.workMode !== "all") params.append("mode", filters.workMode);

      const qs = params.toString() ? `?${params.toString()}` : "";
      return await this.request<Opportunity[]>(`/opportunities${qs}`);
    } catch {
      return mockRepository.getOpportunities(filters);
    }
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    try {
      return await this.request<Opportunity>(`/opportunities/${id}`);
    } catch {
      return mockRepository.getOpportunityById(id);
    }
  }

  async getHackathons(): Promise<Hackathon[]> {
    try {
      return await this.request<Hackathon[]>("/hackathons");
    } catch {
      return mockRepository.getHackathons();
    }
  }

  async getHackathonById(id: string): Promise<Hackathon | null> {
    try {
      return await this.request<Hackathon>(`/hackathons/${id}`);
    } catch {
      return mockRepository.getHackathonById(id);
    }
  }

  async getSavedOpportunities(): Promise<Opportunity[]> {
    try {
      return await this.request<Opportunity[]>("/opportunities/saved");
    } catch {
      return mockRepository.getSavedOpportunities();
    }
  }

  async toggleSaveOpportunity(id: string): Promise<boolean> {
    try {
      const res = await this.request<{ isSaved: boolean }>(
        `/opportunities/${id}/save`,
        { method: "POST" }
      );
      return res.isSaved;
    } catch {
      return mockRepository.toggleSaveOpportunity(id);
    }
  }

  async getStudentProfile(): Promise<StudentProfile> {
    try {
      return await this.request<StudentProfile>("/profile");
    } catch {
      return mockRepository.getStudentProfile();
    }
  }

  async updateStudentProfile(
    updates: Partial<StudentProfile>
  ): Promise<StudentProfile> {
    try {
      return await this.request<StudentProfile>("/profile", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    } catch {
      return mockRepository.updateStudentProfile(updates);
    }
  }
}

export const apiClient = new ApiClient();
