-- ==============================================================================
-- Vidya Sarthi: Student Platform Schema with pgvector
-- Target: Supabase PostgreSQL
-- Features:
--   1. pgvector extension for semantic resume & opportunity matching
--   2. Student profiles table synced with auth.users
--   3. Opportunities repository table with vector embeddings
--   4. Row Level Security (RLS) policies
--   5. Auto-profile trigger on email/password registration
--   6. Vector cosine similarity matching stored procedures
-- ==============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create Custom Types & Enums
DO $$ BEGIN
    CREATE TYPE opportunity_type_enum AS ENUM (
        'job', 'internship', 'hackathon', 'competition', 'mentorship_fellowship'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_mode_enum AS ENUM (
        'remote', 'hybrid', 'in-office'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Student Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    avatar_url TEXT,
    headline TEXT,
    college TEXT,
    degree TEXT,
    branch TEXT,
    graduating_year INT,
    location TEXT,
    skills TEXT[] DEFAULT '{}',
    soft_skills TEXT[] DEFAULT '{}',
    target_roles TEXT[] DEFAULT '{}',
    preferred_locations TEXT[] DEFAULT '{}',
    preferred_work_modes TEXT[] DEFAULT '{}',
    resume_url TEXT,
    resume_file_name TEXT,
    resume_raw_text TEXT,
    -- 384-dimensional vector embedding (standard for sentence-transformers all-MiniLM-L6-v2)
    resume_embedding vector(384),
    has_completed_profile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Opportunities Table (Normalized Ingestion Pool)
CREATE TABLE IF NOT EXISTS public.opportunities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    organization TEXT,
    company_logo_url TEXT,
    type opportunity_type_enum NOT NULL DEFAULT 'job',
    location TEXT NOT NULL,
    work_mode work_mode_enum NOT NULL DEFAULT 'remote',
    stipend_or_salary TEXT,
    deadline TIMESTAMPTZ,
    original_posting_url TEXT NOT NULL,
    canonical_url TEXT,
    official_source TEXT NOT NULL,
    source_record_id TEXT,
    status TEXT DEFAULT 'published',
    tags TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    description TEXT,
    description_snippet TEXT,
    eligibility TEXT,
    experience_level TEXT DEFAULT 'entry_level',
    validation_errors TEXT[] DEFAULT '{}',
    duplicate_of_id TEXT,
    similarity_score FLOAT,
    ingestion_batch_id TEXT,
    -- 384-dimensional vector embedding for semantic search & opportunity matching
    embedding vector(384),
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Saved Opportunities Bookmark Table
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id TEXT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, opportunity_id)
);

-- 6. HNSW Indexes for Blazing Fast Vector Cosine Similarity Search
CREATE INDEX IF NOT EXISTS idx_profiles_resume_embedding 
ON public.profiles USING hnsw (resume_embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_opportunities_embedding 
ON public.opportunities USING hnsw (embedding vector_cosine_ops);

-- Standard B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON public.opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(deadline);

-- 7. Automated Profile Provisioning Trigger
-- When a student signs up with Email/Password, Supabase auth.users automatically creates a row in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        college,
        degree,
        graduating_year,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'college', ''),
        COALESCE(NEW.raw_user_meta_data->>'degree', 'B.Tech Computer Science and Engineering'),
        COALESCE((NEW.raw_user_meta_data->>'graduating_year')::INT, 2027),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Stored Procedure: Match Opportunities for Student using pgvector
CREATE OR REPLACE FUNCTION match_opportunities_for_student(
    target_student_id UUID,
    match_threshold FLOAT DEFAULT 0.60,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    company TEXT,
    type opportunity_type_enum,
    location TEXT,
    work_mode work_mode_enum,
    stipend_or_salary TEXT,
    deadline TIMESTAMPTZ,
    original_posting_url TEXT,
    required_skills TEXT[],
    similarity FLOAT
) AS $$
DECLARE
    student_vec vector(384);
BEGIN
    -- Retrieve the student's resume embedding
    SELECT resume_embedding INTO student_vec
    FROM public.profiles
    WHERE public.profiles.id = target_student_id;

    IF student_vec IS NULL THEN
        -- If no vector embedding exists yet, return recent published opportunities
        RETURN QUERY
        SELECT 
            o.id,
            o.title,
            o.company,
            o.type,
            o.location,
            o.work_mode,
            o.stipend_or_salary,
            o.deadline,
            o.original_posting_url,
            o.required_skills,
            0.5::FLOAT as similarity
        FROM public.opportunities o
        WHERE o.status = 'published'
        ORDER BY o.created_at DESC
        LIMIT match_count;
    ELSE
        -- Return cosine similarity rank (1 - cosine distance)
        RETURN QUERY
        SELECT 
            o.id,
            o.title,
            o.company,
            o.type,
            o.location,
            o.work_mode,
            o.stipend_or_salary,
            o.deadline,
            o.original_posting_url,
            o.required_skills,
            (1 - (o.embedding <=> student_vec))::FLOAT as similarity
        FROM public.opportunities o
        WHERE o.status = 'published'
          AND o.embedding IS NOT NULL
          AND (1 - (o.embedding <=> student_vec)) >= match_threshold
        ORDER BY o.embedding <=> student_vec ASC
        LIMIT match_count;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Profiles: Students can read and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Opportunities: Any authenticated user can read published opportunities
CREATE POLICY "Authenticated users can view published opportunities" 
ON public.opportunities FOR SELECT 
TO authenticated
USING (status = 'published');

-- Saved Opportunities: Users can manage their own saved opportunities
CREATE POLICY "Users can view own saved opportunities" 
ON public.saved_opportunities FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own saved opportunities" 
ON public.saved_opportunities FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can delete own saved opportunities" 
ON public.saved_opportunities FOR DELETE 
USING (auth.uid() = student_id);
