export type UserRole = "student" | "admin";

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  role?: UserRole;
  avatarUrl?: string;
  headline?: string;
  college?: string;
  degree?: string;
  graduatingYear?: number;
  location?: string;
  skills: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  hasCompletedProfile: boolean;
}

export interface UserSession {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
