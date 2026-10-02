import {
  ProfileIntelligenceData,
  SkillEvidence,
} from "@/types/intelligence";

const defaultMockIntelligence: ProfileIntelligenceData = {
  studentId: "student-001",
  fullName: "Aarav Sharma",
  headline: "B.Tech Computer Science | Full-Stack & Systems Enthusiast",
  college: "Indian Institute of Information Technology",
  email: "aarav.sharma@campus.edu.in",
  analysisVersion: "v1.2.4-nlp",
  lastAnalyzedAt: "2026-10-02T08:15:00Z",
  completenessPercentage: 88,
  completenessChecklist: [
    { label: "Verified Academic Credentials", completed: true, importance: "required" },
    { label: "Core Technical Skills Normalized", completed: true, importance: "required" },
    { label: "Resume Document Parsed", completed: true, importance: "required" },
    { label: "Career & Work Preferences Declared", completed: true, importance: "required" },
    { label: "Public GitHub / Portfolio Inspected", completed: true, importance: "recommended" },
    { label: "Competitive Programming / Hackathon History", completed: false, importance: "recommended" },
  ],
  skills: [
    {
      id: "sk-1",
      name: "TypeScript",
      category: "languages",
      sources: ["resume", "portfolio_github", "manual"],
      status: "confirmed",
      contextSnippet: "Primary language across all 3 production web projects and open source tooling",
      firstDetectedAt: "2026-09-15",
    },
    {
      id: "sk-2",
      name: "React & Next.js",
      category: "frameworks",
      sources: ["resume", "portfolio_github"],
      status: "confirmed",
      contextSnippet: "Built accessible student opportunity surfaces and internal dashboards",
      firstDetectedAt: "2026-09-15",
    },
    {
      id: "sk-3",
      name: "Go (Golang)",
      category: "languages",
      sources: ["resume", "portfolio_github"],
      status: "confirmed",
      contextSnippet: "Implemented concurrent task workers with goroutines and channels",
      firstDetectedAt: "2026-09-20",
    },
    {
      id: "sk-4",
      name: "PostgreSQL",
      category: "databases",
      sources: ["resume", "manual"],
      status: "confirmed",
      contextSnippet: "Academic coursework database project and relational schema modeling",
      firstDetectedAt: "2026-09-15",
    },
    {
      id: "sk-5",
      name: "Docker",
      category: "systems_cloud",
      sources: ["resume"],
      status: "confirmed",
      contextSnippet: "Containerized multi-container full-stack environments with docker-compose",
      firstDetectedAt: "2026-09-28",
    },
    {
      id: "sk-6",
      name: "Redis",
      category: "databases",
      sources: ["portfolio_github"],
      status: "suggested",
      contextSnippet: "Detected in distributed-task-worker repository imports",
      firstDetectedAt: "2026-10-01",
    },
    {
      id: "sk-7",
      name: "Kubernetes",
      category: "systems_cloud",
      sources: ["resume"],
      status: "suggested",
      contextSnippet: "Found in resume extracurricular reading list (unverified repository evidence)",
      firstDetectedAt: "2026-10-01",
    },
    {
      id: "sk-8",
      name: "Systematic Debugging",
      category: "soft_skills",
      sources: ["manual", "project_description"],
      status: "confirmed",
      contextSnippet: "Demonstrated in performance optimization profiling logs",
      firstDetectedAt: "2026-09-15",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Technology",
      college: "Indian Institute of Information Technology",
      branch: "Computer Science and Engineering",
      graduationYear: 2027,
      isVerified: true,
    },
  ],
  experience: [
    {
      id: "exp-1",
      role: "Software Engineering Intern - Frontend",
      organization: "Razorpay (Merchant Platform)",
      type: "internship",
      startDate: "Jun 2026",
      endDate: "Aug 2026",
      isCurrent: false,
      description:
        "Contributed to the payment checkout UI components, improving keyboard navigation and WCAG accessibility standards.",
      source: "resume",
      extractedTechnologies: ["TypeScript", "React", "Tailwind CSS", "Jest"],
    },
    {
      id: "exp-2",
      role: "Undergraduate Systems Project",
      organization: "Distributed Computing Lab, IIIT",
      type: "project",
      startDate: "Jan 2026",
      endDate: "May 2026",
      isCurrent: false,
      description:
        "Designed and evaluated a fault-tolerant distributed key-value store implementing Raft consensus algorithms.",
      source: "project_description",
      extractedTechnologies: ["Go", "Distributed Systems", "Linux", "gRPC"],
    },
  ],
  portfolio: {
    analyzedUrl: "https://github.com/aarav-sharma",
    status: "verified",
    lastAnalyzedAt: "2026-10-02T08:15:00Z",
    repositories: [
      {
        repoName: "distributed-task-worker",
        url: "https://github.com/aarav-sharma/distributed-task-worker",
        description:
          "Fault-tolerant background job queue implemented in Go with Redis streams",
        primaryLanguage: "Go",
        detectedTechnologies: ["Go", "Redis", "Docker"],
        starsCount: 4,
        lastUpdated: "2026-09-20",
        qualityObservations: [
          "Demonstrates clean concurrency and channel management",
          "Unit test coverage is currently 62%; consider adding end-to-end integration tests",
        ],
      },
      {
        repoName: "vidya-sarthi-ui",
        url: "https://github.com/aarav-sharma/vidya-sarthi-ui",
        description:
          "Accessible Next.js 16 design system and opportunity discovery platform for students",
        primaryLanguage: "TypeScript",
        detectedTechnologies: ["TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
        starsCount: 12,
        lastUpdated: "2026-10-01",
        qualityObservations: [
          "Rigorous WCAG AA contrast ratio compliance verified",
          "Clean separation of tokens and UI primitives",
        ],
      },
    ],
    overallStrengths: [
      "Demonstrated multi-language engineering breadth across Go and TypeScript",
      "Explicit commit history showcasing iterative architecture improvements",
    ],
    suggestedImprovements: [
      "Add architecture sequence diagrams to distributed project READMEs",
      "Include continuous integration test badges to verify automated build pipelines",
    ],
  },
  careerGaps: [
    {
      targetRole: "Systems & Distributed Backend Engineer",
      supportedSkills: ["Go", "Linux", "Docker", "PostgreSQL"],
      recommendedSkillsToAcquire: ["Kubernetes", "Kafka", "Distributed Tracing (OpenTelemetry)"],
      rationale:
        "Your verified Go and distributed systems lab coursework provides a strong foundation. Prioritizing message queues (Kafka) and cluster orchestration (Kubernetes) will position you directly for Tier-1 backend roles.",
      suggestedProjectAreas: [
        "Implement an event-driven pub-sub broker with persistent log partitions",
        "Deploy a multi-service Go application onto a local Kubernetes (Kind/k3s) cluster with Helm charts",
      ],
    },
    {
      targetRole: "Software Development Engineer - Frontend",
      supportedSkills: ["TypeScript", "React & Next.js", "Tailwind CSS"],
      recommendedSkillsToAcquire: ["GraphQL", "Web Vitals Optimization", "Automated E2E Testing (Playwright)"],
      rationale:
        "Strong component engineering foundation with clean design token utilization. Mastering deep Core Web Vitals optimization and end-to-end testing will elevate your profile for high-growth tech firms.",
      suggestedProjectAreas: [
        "Build a virtualized infinite-scroll feed benchmarked to 60fps on low-end mobile devices",
      ],
    },
  ],
  resumeMetadata: {
    fileName: "Aarav_Sharma_Resume_2026.pdf",
    fileSizeBytes: 248500,
    parsedAt: "2026-10-01T14:30:00Z",
    confidenceTier: "high",
    confidenceExplanation:
      "High Confidence: All core sections (Education, Skills, Experience, Projects) were structurally recognized with exact lexicon matching.",
    rawSnippet:
      "Aarav Sharma • IIIT Bengaluru • B.Tech CSE (2023-2027) • Skills: Go, TypeScript, React, PostgreSQL, Docker • Intern at Razorpay • Raft consensus implementation.",
  },
};

const STORAGE_KEY = "vidya_sarthi_profile_intelligence_state";

export async function getProfileIntelligence(): Promise<ProfileIntelligenceData> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback to mock
    }
  }
  return defaultMockIntelligence;
}

export async function saveProfileIntelligence(
  data: ProfileIntelligenceData
): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export async function updateSkillStatus(
  skillId: string,
  newStatus: "confirmed" | "rejected"
): Promise<ProfileIntelligenceData> {
  const current = await getProfileIntelligence();
  const updatedSkills = current.skills.map((s) =>
    s.id === skillId ? { ...s, status: newStatus } : s
  );
  const updated = {
    ...current,
    skills: updatedSkills,
    lastAnalyzedAt: new Date().toISOString(),
  };
  await saveProfileIntelligence(updated);
  return updated;
}

export async function addCustomSkill(
  name: string,
  category: SkillEvidence["category"]
): Promise<ProfileIntelligenceData> {
  const current = await getProfileIntelligence();
  const newSkill: SkillEvidence = {
    id: `sk-${Date.now()}`,
    name,
    category,
    sources: ["manual"],
    status: "confirmed",
    contextSnippet: "Manually declared and confirmed by student",
    firstDetectedAt: new Date().toISOString().split("T")[0],
  };
  const updated = {
    ...current,
    skills: [...current.skills, newSkill],
    lastAnalyzedAt: new Date().toISOString(),
  };
  await saveProfileIntelligence(updated);
  return updated;
}
