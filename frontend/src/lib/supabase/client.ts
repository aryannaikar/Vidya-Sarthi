import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { StudentProfile } from "@/types/user";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseAnonKey.includes("your-anon-") &&
    supabaseAnonKey.length > 20
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

/**
 * Register a new student with Email & Password
 */
export async function signUpStudent(
  email: string,
  password: string,
  metadata: {
    fullName: string;
    college?: string;
    graduatingYear?: number;
    degree?: string;
  }
) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata.fullName,
        college: metadata.college || "",
        degree: metadata.degree || "B.Tech Computer Science and Engineering",
        graduating_year: metadata.graduatingYear || 2027,
        role: "student",
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in existing student with Email & Password
 */
export async function signInStudent(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out current student session
 */
export async function signOutStudent() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * Fetch detailed student profile from Supabase 'profiles' table
 */
export async function fetchStudentProfile(
  userId: string
): Promise<StudentProfile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      role: data.role || "student",
      avatarUrl: data.avatar_url,
      headline: data.headline,
      college: data.college,
      degree: data.degree,
      graduatingYear: data.graduating_year,
      location: data.location,
      skills: data.skills || [],
      resumeUrl: data.resume_url,
      resumeFileName: data.resume_file_name,
      hasCompletedProfile: data.has_completed_profile || false,
    };
  } catch (err) {
    console.error("Error fetching Supabase profile:", err);
    return null;
  }
}

/**
 * Update student profile in Supabase 'profiles' table
 */
export async function updateStudentProfile(
  userId: string,
  updates: Partial<{
    full_name: string;
    college: string;
    degree: string;
    graduating_year: number;
    headline: string;
    location: string;
    skills: string[];
    target_roles: string[];
    preferred_locations: string[];
    preferred_work_modes: string[];
    resume_url: string;
    resume_file_name: string;
    resume_raw_text: string;
    resume_embedding: number[];
    has_completed_profile: boolean;
  }>
) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Vector similarity matching using Supabase pgvector stored procedure
 */
export async function matchOpportunitiesWithPgVector(
  studentId: string,
  matchCount: number = 10,
  matchThreshold: number = 0.60
) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("match_opportunities_for_student", {
    target_student_id: studentId,
    match_threshold: matchThreshold,
    match_count: matchCount,
  });

  if (error) {
    console.error("Error calling pgvector match procedure:", error);
    return [];
  }

  return data || [];
}
