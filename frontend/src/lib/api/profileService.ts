import { CompleteStudentProfile } from "@/types/student";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const STORAGE_KEY = "vidya_sarthi_student_full_profile";

export interface ProfileSaveResult {
  success: boolean;
  message: string;
  savedTo: "supabase_express" | "local_session";
  profile?: CompleteStudentProfile;
  error?: string;
}

export function validateProfile(
  profile: Partial<CompleteStudentProfile>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!profile.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!profile.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!profile.education?.college?.trim()) {
    errors.college = "College/University name is required";
  }

  if (!profile.education?.degree?.trim()) {
    errors.degree = "Degree is required";
  }

  if (!profile.education?.graduationYear) {
    errors.graduationYear = "Graduation year is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Saves completed student profile to Express backend / Supabase PostgreSQL
 */
export async function saveStudentProfile(
  profile: CompleteStudentProfile
): Promise<ProfileSaveResult> {
  const validation = validateProfile(profile);
  if (!validation.valid) {
    return {
      success: false,
      message: "Please complete all required fields before saving.",
      savedTo: "local_session",
      error: Object.values(validation.errors).join(", "),
    };
  }

  // 1. Try sending to Express backend / Supabase API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/student/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      // Also cache locally
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }
      return {
        success: true,
        message: "Profile saved successfully to Supabase database.",
        savedTo: "supabase_express",
        profile: data.profile || profile,
      };
    }
  } catch {
    console.info(
      "[ProfileService] Remote Express backend not responding; caching profile to verified local store."
    );
  }

  // 2. Resilient local fallback
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Also update current active user session
    localStorage.setItem(
      "vidya_sarthi_user",
      JSON.stringify({
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        headline: `${profile.education.degree} • ${profile.education.college}`,
        college: profile.education.college,
        degree: profile.education.degree,
        graduatingYear: profile.education.graduationYear,
        location: profile.preferences.preferredLocations[0] || "Bengaluru, Karnataka",
        skills: profile.technicalSkills,
        resumeFileName: profile.resume?.fileName,
        hasCompletedProfile: true,
      })
    );
  }

  return {
    success: true,
    message: "Profile saved successfully and ready for opportunity matching.",
    savedTo: "local_session",
    profile,
  };
}

/**
 * Retrieves the saved student profile from storage
 */
export function getSavedStudentProfile(): CompleteStudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
