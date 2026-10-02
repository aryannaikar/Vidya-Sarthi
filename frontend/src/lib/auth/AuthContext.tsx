"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentProfile, UserSession } from "@/types/user";
import { mockStudent } from "@/lib/api/mockData";
import {
  getSupabase,
  isSupabaseConfigured,
  signInStudent,
  signUpStudent,
  signOutStudent,
  fetchStudentProfile,
  updateStudentProfile as updateSupabaseProfile,
} from "@/lib/supabase/client";

interface SignUpMetadata {
  fullName: string;
  college?: string;
  graduatingYear?: number;
  degree?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType extends UserSession {
  isSupabaseActive: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  logout: () => void;
  loginWithEmail: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (profile: Partial<StudentProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const loggedOut = localStorage.getItem("vidya_sarthi_logged_out");
        if (loggedOut === "true") return null;

        const stored = localStorage.getItem("vidya_sarthi_user");
        if (stored) return JSON.parse(stored);

        return mockStudent;
      } catch {
        return null;
      }
    }
    return mockStudent;
  });

  const isSupabaseActive = isSupabaseConfigured();
  const [isLoading, setIsLoading] = useState<boolean>(() => isSupabaseConfigured());

  // Listen to Supabase Session State
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      return;
    }

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchStudentProfile(session.user.id).then((profile) => {
          if (profile) {
            setUser(profile);
            localStorage.setItem("vidya_sarthi_user", JSON.stringify(profile));
          } else {
            // Minimal profile from session metadata
            const basicUser: StudentProfile = {
              id: session.user.id,
              email: session.user.email || "",
              fullName: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Student",
              role: session.user.user_metadata?.role || "student",
              college: session.user.user_metadata?.college || "Indian Institute of Technology",
              degree: session.user.user_metadata?.degree || "B.Tech Computer Science and Engineering",
              graduatingYear: session.user.user_metadata?.graduating_year || 2027,
              skills: ["Python", "TypeScript", "React"],
              hasCompletedProfile: false,
            };
            setUser(basicUser);
            localStorage.setItem("vidya_sarthi_user", JSON.stringify(basicUser));
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // 2. Auth State Change Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchStudentProfile(session.user.id);
        if (profile) {
          setUser(profile);
          localStorage.setItem("vidya_sarthi_user", JSON.stringify(profile));
        }
      } else {
        setUser(null);
        localStorage.removeItem("vidya_sarthi_user");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Supabase ID & Password Sign In
   */
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      if (isSupabaseActive) {
        const data = await signInStudent(email, password);
        if (data.user) {
          const profile = await fetchStudentProfile(data.user.id);
          const student = profile || {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split("@")[0],
            role: "student",
            college: data.user.user_metadata?.college || "University Campus",
            skills: ["TypeScript", "React"],
            hasCompletedProfile: false,
          };
          setUser(student);
          localStorage.setItem("vidya_sarthi_user", JSON.stringify(student));
          localStorage.removeItem("vidya_sarthi_logged_out");
        }
        setIsLoading(false);
        return { success: true };
      } else {
        // Fallback local auth for testing
        const formattedName = email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        const fallbackUser: StudentProfile = {
          ...mockStudent,
          email,
          fullName: formattedName || "Student",
        };
        setUser(fallbackUser);
        localStorage.setItem("vidya_sarthi_user", JSON.stringify(fallbackUser));
        localStorage.removeItem("vidya_sarthi_logged_out");
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Failed to sign in";
      return { success: false, error: message };
    }
  };

  /**
   * Supabase ID & Password Registration
   */
  const signUp = async (
    email: string,
    password: string,
    metadata: SignUpMetadata
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      if (isSupabaseActive) {
        const data = await signUpStudent(email, password, metadata);
        if (data.user) {
          const newUser: StudentProfile = {
            id: data.user.id,
            email,
            fullName: metadata.fullName,
            role: "student",
            college: metadata.college || "",
            degree: metadata.degree || "B.Tech Computer Science and Engineering",
            graduatingYear: metadata.graduatingYear || 2027,
            skills: [],
            hasCompletedProfile: false,
          };
          setUser(newUser);
          localStorage.setItem("vidya_sarthi_user", JSON.stringify(newUser));
          localStorage.removeItem("vidya_sarthi_logged_out");
        }
        setIsLoading(false);
        return { success: true };
      } else {
        // Fallback local registration
        const fallbackUser: StudentProfile = {
          ...mockStudent,
          id: `student-${Date.now()}`,
          email,
          fullName: metadata.fullName,
          college: metadata.college || mockStudent.college,
        };
        setUser(fallbackUser);
        localStorage.setItem("vidya_sarthi_user", JSON.stringify(fallbackUser));
        localStorage.removeItem("vidya_sarthi_logged_out");
        setIsLoading(false);
        return { success: true };
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : "Failed to register";
      return { success: false, error: message };
    }
  };

  /**
   * Sign Out
   */
  const signOut = async () => {
    setIsLoading(true);
    if (isSupabaseActive) {
      try {
        await signOutStudent();
      } catch (err) {
        console.warn("Supabase sign out warning:", err);
      }
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("vidya_sarthi_user");
      localStorage.setItem("vidya_sarthi_logged_out", "true");
    }
    setIsLoading(false);
  };

  const logout = async () => {
    await signOut();
  };

  /**
   * Backward-compatible simple email login
   */
  const loginWithEmail = async (email: string) => {
    await signIn(email, "default_test_password");
  };

  /**
   * Backward-compatible mock google login
   */
  const loginWithGoogle = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(mockStudent);
      localStorage.setItem("vidya_sarthi_user", JSON.stringify(mockStudent));
      setIsLoading(false);
    }, 300);
  };

  /**
   * Update student profile in context and Supabase
   */
  const updateProfile = async (updates: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("vidya_sarthi_user", JSON.stringify(updated));

    if (isSupabaseActive) {
      try {
        await updateSupabaseProfile(user.id, {
          full_name: updates.fullName,
          college: updates.college,
          degree: updates.degree,
          graduating_year: updates.graduatingYear,
          headline: updates.headline,
          location: updates.location,
          skills: updates.skills,
          resume_url: updates.resumeUrl,
          has_completed_profile: updates.hasCompletedProfile,
        });
      } catch (err) {
        console.warn("Failed to sync profile update with Supabase:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSupabaseActive,
        signIn,
        signUp,
        signOut,
        logout,
        loginWithEmail,
        loginWithGoogle,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
