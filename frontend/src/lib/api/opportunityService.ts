import {
  Opportunity,
  OpportunityFilters,
  IngestionRunMetrics,
  IngestionSourceSummary,
  IngestionRunResult,
} from "@/types/opportunity";

const PYTHON_FASTAPI_URL =
  process.env.NEXT_PUBLIC_NLP_API_URL || "http://127.0.0.1:8000";

// Fallback high-fidelity normalized dataset across all 5 mandatory opportunity types
const inMemoryOpportunities: Opportunity[] = [
  {
    id: "opp-emp-dir-part-101",
    title: "Graduate Software Engineer (Platform Infrastructure)",
    company: "Razorpay",
    organization: "Razorpay",
    type: "job",
    location: "Bengaluru, Karnataka",
    workMode: "hybrid",
    stipendOrSalary: "₹16 - 22 LPA",
    deadline: "2026-11-10T18:00:00Z",
    daysRemaining: 39,
    originalPostingUrl: "https://razorpay.com/jobs/grad-software-engineer-2026",
    canonicalUrl: "https://razorpay.com/jobs/grad-software-engineer-2026",
    postedAt: "2026-10-01T08:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "employer_direct",
    sourceRecordId: "dir-part-101",
    status: "published",
    requiredSkills: ["Go", "Distributed Systems", "Kafka"],
    preferredSkills: ["PostgreSQL", "Docker", "Linux"],
    tags: ["JOB", "Bengaluru", "Go", "Kafka"],
    descriptionSnippet:
      "Join the core payments routing team. Build fault-tolerant microservices handling millions of transactions daily using Go, Kafka, and PostgreSQL.",
    description:
      "Razorpay is hiring Graduate Engineers for the Core Payments Platform. You will design, build, and maintain high-throughput microservices capable of processing over 10,000 transactions per second. Mentorship is provided by Principal Architects.",
    eligibility: "B.Tech/B.E. 2026 or recent 2025 graduates in CS/IT/ECE",
    experienceLevel: "fresher",
    isSaved: true,
  },
  {
    id: "opp-emp-dir-part-102",
    title: "Frontend Engineering Intern",
    company: "Swiggy",
    organization: "Swiggy",
    type: "internship",
    location: "Bengaluru, Karnataka",
    workMode: "hybrid",
    stipendOrSalary: "₹50,000 / month",
    deadline: "2026-10-25T18:00:00Z",
    daysRemaining: 23,
    originalPostingUrl: "https://careers.swiggy.com/engineering-intern-frontend-2026",
    canonicalUrl: "https://careers.swiggy.com/engineering-intern-frontend-2026",
    postedAt: "2026-10-01T09:30:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "employer_direct",
    sourceRecordId: "dir-part-102",
    status: "published",
    requiredSkills: ["TypeScript", "Next.js", "React"],
    preferredSkills: ["Tailwind CSS", "Web Performance"],
    tags: ["INTERNSHIP", "Bengaluru", "TypeScript", "React"],
    descriptionSnippet:
      "Collaborate on high-performance consumer web applications using Next.js, React, and Tailwind CSS. Focus on sub-second load times and accessible UX.",
    description:
      "As a Frontend Engineering Intern at Swiggy, you will work on customer-facing interfaces used by millions. You will optimize web vitals, implement accessible component systems, and integrate with GraphQL backends.",
    eligibility: "Pre-final and final year undergraduate students",
    experienceLevel: "student",
    isSaved: false,
  },
  {
    id: "opp-nat-hack-01",
    title: "Smart India Innovation Hackathon 2026",
    company: "Ministry of Education & AICTE",
    organization: "Ministry of Education & AICTE",
    type: "hackathon",
    location: "New Delhi / Hybrid",
    workMode: "hybrid",
    stipendOrSalary: "₹15,00,000 Prize Pool",
    deadline: "2026-10-30T18:00:00Z",
    daysRemaining: 28,
    originalPostingUrl: "https://sih.gov.in/register-2026",
    canonicalUrl: "https://sih.gov.in/register-2026",
    postedAt: "2026-09-15T00:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "unstop_public",
    sourceRecordId: "hack-nat-2026-01",
    status: "published",
    requiredSkills: ["Python", "FastAPI", "React"],
    preferredSkills: ["Docker", "Machine Learning"],
    tags: ["HACKATHON", "National", "AICTE", "₹15L Prize"],
    descriptionSnippet:
      "Nationwide digital initiative to solve pressing public infrastructure problems spanning smart mobility, healthcare, and education with AI.",
    description:
      "The flagship national coding hackathon challenging university student teams to develop working prototypes for verified public sector ministry problem statements.",
    eligibility: "Open to all enrolled Indian college students across AICTE/UGC approved institutes",
    experienceLevel: "student",
    isSaved: true,
  },
  {
    id: "opp-nat-comp-02",
    title: "Flipkart GRiD 7.0 - Information Security & Systems Track",
    company: "Flipkart Engineering",
    organization: "Flipkart Engineering",
    type: "competition",
    location: "Bengaluru / Online",
    workMode: "remote",
    stipendOrSalary: "₹5,25,000 + PPI Opportunity",
    deadline: "2026-11-05T23:59:59Z",
    daysRemaining: 34,
    originalPostingUrl: "https://unstop.com/competitions/flipkart-grid-7-systems",
    canonicalUrl: "https://unstop.com/competitions/flipkart-grid-7-systems",
    postedAt: "2026-09-20T00:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "unstop_public",
    sourceRecordId: "hack-nat-2026-02",
    status: "published",
    requiredSkills: ["Go", "Distributed Systems", "PostgreSQL"],
    preferredSkills: ["System Design", "Linux"],
    tags: ["COMPETITION", "PPI Opportunity", "Go", "Systems"],
    descriptionSnippet:
      "Flagship engineering campus challenge testing distributed system design, API throughput optimization, and resilient microservice architecture.",
    description:
      "Competitive engineering sprint with multi-tier elimination rounds evaluating algorithm efficiency, concurrency control, and distributed consensus.",
    eligibility: "Engineering students graduating in 2026 and 2027",
    experienceLevel: "student",
    isSaved: false,
  },
  {
    id: "opp-nat-fellow-03",
    title: "AWS Cloud Architecture Student Fellowship",
    company: "Amazon Web Services",
    organization: "Amazon Web Services",
    type: "mentorship_fellowship",
    location: "Hyderabad, Telangana / Remote",
    workMode: "remote",
    stipendOrSalary: "$10,000 Cloud Credits + Direct Mentorship",
    deadline: "2026-11-20T23:59:59Z",
    daysRemaining: 49,
    originalPostingUrl: "https://aws.amazon.com/developer/community/student-fellowship-2026/",
    canonicalUrl: "https://aws.amazon.com/developer/community/student-fellowship-2026",
    postedAt: "2026-09-25T00:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "unstop_public",
    sourceRecordId: "hack-nat-2026-03",
    status: "published",
    requiredSkills: ["AWS", "Linux", "Docker"],
    preferredSkills: ["Python", "Kubernetes"],
    tags: ["FELLOWSHIP", "AWS Mentorship", "Cloud"],
    descriptionSnippet:
      "Six-month cohort-based development fellowship for third and final-year undergraduates building scalable web solutions on cloud primitives.",
    description:
      "Intensive practical fellowship with assigned AWS Senior Solutions Architects, monthly architecture reviews, and hands-on production deployments.",
    eligibility: "Enrolled university students with foundational cloud or backend projects",
    experienceLevel: "student",
    isSaved: false,
  },
  {
    id: "opp-rem-182901",
    title: "Junior Full-Stack Engineer (React / TypeScript)",
    company: "Distributed Systems Labs",
    organization: "Distributed Systems Labs",
    type: "job",
    location: "Remote - Worldwide",
    workMode: "remote",
    stipendOrSalary: "$60,000 - $80,000 / year",
    deadline: "2026-11-15T23:59:59Z",
    daysRemaining: 44,
    originalPostingUrl: "https://remotive.com/remote-jobs/software-dev/junior-full-stack-engineer-182901",
    canonicalUrl: "https://remotive.com/remote-jobs/software-dev/junior-full-stack-engineer-182901",
    postedAt: "2026-09-28T09:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "remotive_feed",
    sourceRecordId: "182901",
    status: "published",
    requiredSkills: ["TypeScript", "React", "Node.js"],
    preferredSkills: ["PostgreSQL", "Docker"],
    tags: ["JOB", "Remote", "TypeScript", "React"],
    descriptionSnippet:
      "Looking for a passionate junior developer with proficiency in TypeScript, React, and REST APIs to join our distributed infrastructure team.",
    description:
      "Fully remote junior developer position contributing to open web tooling, distributed databases, and real-time frontend dashboards.",
    eligibility: "Open to international candidates with fluent English communication",
    experienceLevel: "entry_level",
    isSaved: false,
  },
  {
    id: "opp-rem-182902",
    title: "Backend Systems Intern (Go & PostgreSQL)",
    company: "CloudStream Networks",
    organization: "CloudStream Networks",
    type: "internship",
    location: "Remote - APAC / India",
    workMode: "remote",
    stipendOrSalary: "₹55,000 / month",
    deadline: "2026-11-15T23:59:59Z",
    daysRemaining: 44,
    originalPostingUrl: "https://remotive.com/remote-jobs/software-dev/backend-systems-intern-182902",
    canonicalUrl: "https://remotive.com/remote-jobs/software-dev/backend-systems-intern-182902",
    postedAt: "2026-09-30T11:30:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "remotive_feed",
    sourceRecordId: "182902",
    status: "published",
    requiredSkills: ["Go", "Docker", "PostgreSQL"],
    preferredSkills: ["Linux", "Git"],
    tags: ["INTERNSHIP", "Remote", "Go", "PostgreSQL"],
    descriptionSnippet:
      "Build high-throughput telemetry services with Go, Docker, and PostgreSQL. Mentorship provided by senior architects.",
    description:
      "Hands-on paid internship focusing on low-latency streaming infrastructure, connection pooling, and automated integration testing.",
    eligibility: "Undergraduates or graduate students graduating in 2026 or 2027",
    experienceLevel: "student",
    isSaved: false,
  },
  {
    id: "opp-val-err-01",
    title: "Cloud Dev",
    company: "HyperScale Tech",
    organization: "HyperScale Tech",
    type: "job",
    location: "Gurgaon, Haryana",
    workMode: "hybrid",
    stipendOrSalary: "Unspecified",
    deadline: "2026-09-01T00:00:00Z",
    daysRemaining: -31,
    originalPostingUrl: "not_a_valid_url",
    canonicalUrl: "",
    postedAt: "2026-08-15T00:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "employer_direct",
    sourceRecordId: "demo-val-01",
    status: "pending_review",
    validationErrors: [
      "Application URL must be a valid http or https protocol link.",
      "Application deadline has expired.",
      "Job description is under minimum word threshold (50 words)."
    ],
    requiredSkills: ["AWS"],
    preferredSkills: [],
    tags: ["JOB", "Validation Error", "Expired"],
    descriptionSnippet: "Short description without role responsibilities.",
    description: "Short description without role responsibilities.",
    eligibility: "Unverified",
    experienceLevel: "entry_level",
    isSaved: false,
  },
  {
    id: "opp-dup-sample-02",
    title: "Frontend Engineering Intern (Web Client)",
    company: "Swiggy",
    organization: "Swiggy",
    type: "internship",
    location: "Bengaluru, Karnataka",
    workMode: "hybrid",
    stipendOrSalary: "₹50,000 / month",
    deadline: "2026-10-25T18:00:00Z",
    daysRemaining: 23,
    originalPostingUrl: "https://remotive.com/jobs/swiggy-frontend-intern-2026?utm_source=aggregator",
    canonicalUrl: "https://remotive.com/jobs/swiggy-frontend-intern-2026",
    postedAt: "2026-10-01T12:00:00Z",
    collectedAt: "2026-10-02T06:00:00Z",
    officialSource: "remotive_feed",
    sourceRecordId: "dup-partner-02",
    status: "flagged_duplicate",
    duplicateOfId: "opp-emp-dir-part-102",
    similarityScore: 0.85,
    requiredSkills: ["TypeScript", "Next.js", "React"],
    preferredSkills: ["Tailwind CSS"],
    tags: ["INTERNSHIP", "Bengaluru", "Potential Duplicate"],
    descriptionSnippet:
      "Internship opening on Swiggy frontend web architecture with React and Next.js.",
    description:
      "Cross-posted entry on external aggregator mirroring the direct Swiggy frontend engineering internship role.",
    eligibility: "College students 2026/2027",
    experienceLevel: "student",
    isSaved: false,
  }
];

let lastRunTime = "2026-10-02T08:30:00Z";
let isCurrentlyIngesting = false;

export const opportunityService = {
  /**
   * Fetch opportunities with administrative filters
   */
  async getAdminOpportunities(filters: OpportunityFilters = {}): Promise<{
    opportunities: Opportunity[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== "all") params.append("status", filters.status);
      if (filters.type && filters.type !== "all") params.append("opp_type", filters.type);
      if (filters.source && filters.source !== "all") params.append("source", filters.source);
      if (filters.searchQuery) params.append("search", filters.searchQuery);

      const res = await fetch(`${PYTHON_FASTAPI_URL}/ingestion/opportunities?${params.toString()}`, {
        cache: "no-store",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        return {
          opportunities: data.opportunities || [],
          total: data.total || 0,
        };
      }
    } catch {
      // Graceful fallback to in-memory store
    }

    let result = [...inMemoryOpportunities];
    if (filters.status && filters.status !== "all") {
      result = result.filter((o) => o.status === filters.status);
    }
    if (filters.type && filters.type !== "all") {
      result = result.filter((o) => o.type === filters.type);
    }
    if (filters.source && filters.source !== "all") {
      result = result.filter((o) => o.officialSource === filters.source);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return {
      opportunities: result,
      total: result.length,
    };
  },

  /**
   * Fetch published opportunities for students
   */
  async getStudentOpportunities(filters: OpportunityFilters = {}): Promise<Opportunity[]> {
    try {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== "all") params.append("opp_type", filters.type);
      if (filters.searchQuery) params.append("search", filters.searchQuery);

      const res = await fetch(`${PYTHON_FASTAPI_URL}/student/opportunities?${params.toString()}`, {
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        return data.opportunities || [];
      }
    } catch {
      // Fallback
    }

    let records = inMemoryOpportunities.filter((o) => o.status === "published");
    if (filters.type && filters.type !== "all") {
      records = records.filter((o) => o.type === filters.type);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      records = records.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q) ||
          o.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return records;
  },

  /**
   * Get Ingestion Engine Status & Metrics
   */
  async getIngestionMetrics(): Promise<IngestionRunMetrics> {
    try {
      const res = await fetch(`${PYTHON_FASTAPI_URL}/ingestion/status`, { cache: "no-store" });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const total = inMemoryOpportunities.length;
    const published = inMemoryOpportunities.filter((o) => o.status === "published").length;
    const pending = inMemoryOpportunities.filter((o) => o.status === "pending_review").length;
    const dups = inMemoryOpportunities.filter((o) => o.status === "flagged_duplicate").length;
    const valFails = inMemoryOpportunities.filter((o) => o.validationErrors && o.validationErrors.length > 0).length;

    return {
      totalIndexed: total,
      publishedCount: published,
      pendingReviewCount: pending,
      flaggedDuplicatesCount: dups,
      validationFailuresCount: valFails,
      lastRunTimestamp: lastRunTime,
      activeSourcesCount: 3,
      isIngesting: isCurrentlyIngesting,
    };
  },

  /**
   * Get registered sources and health audits
   */
  async getSourceSummaries(): Promise<IngestionSourceSummary[]> {
    try {
      const res = await fetch(`${PYTHON_FASTAPI_URL}/ingestion/sources`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        return data.sources || [];
      }
    } catch {
      // Fallback
    }

    return [
      {
        sourceId: "remotive_feed",
        name: "Remotive Remote Engineering Feed",
        provider: "Remotive Developer API",
        type: "job",
        status: "healthy",
        lastSync: lastRunTime,
        recordsFetched: 3,
        recordsPublished: 2,
        complianceNotes: "Permitted public developer API under Remotive community terms",
        rateLimitInfo: "Public REST, 15 req/min, free redistribution",
      },
      {
        sourceId: "unstop_public",
        name: "National Student Hackathons & Sprints",
        provider: "National Developer Competition Feeds",
        type: "hackathon",
        status: "healthy",
        lastSync: lastRunTime,
        recordsFetched: 3,
        recordsPublished: 3,
        complianceNotes: "Public event syndicate for student participation",
        rateLimitInfo: "Public JSON syndicate, cached 1h interval",
      },
      {
        sourceId: "employer_direct",
        name: "Direct University Partner Feeds",
        provider: "Vidya Sarthi Campus Recruitment Exchange",
        type: "multi",
        status: "healthy",
        lastSync: lastRunTime,
        recordsFetched: 4,
        recordsPublished: 2,
        complianceNotes: "Direct employer submission with student distribution consent",
        rateLimitInfo: "Authenticated Partner Webhook, Real-Time",
      },
    ];
  },

  /**
   * Trigger Manual or Scheduled Ingestion Run
   */
  async triggerIngestionPipeline(): Promise<IngestionRunResult> {
    isCurrentlyIngesting = true;
    try {
      const res = await fetch(`${PYTHON_FASTAPI_URL}/ingestion/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const result = await res.json();
        isCurrentlyIngesting = false;
        lastRunTime = result.runAt;
        return result;
      }
    } catch {
      // Fallback
    }

    await new Promise((r) => setTimeout(r, 600));
    isCurrentlyIngesting = false;
    lastRunTime = new Date().toISOString();

    const sources = await this.getSourceSummaries();
    return {
      batchId: `batch-${Date.now()}`,
      runAt: lastRunTime,
      totalCollected: inMemoryOpportunities.length,
      newPublished: inMemoryOpportunities.filter((o) => o.status === "published").length,
      duplicatesCaught: inMemoryOpportunities.filter((o) => o.status === "flagged_duplicate").length,
      validationErrors: inMemoryOpportunities.filter((o) => o.status === "pending_review").length,
      durationMs: 460,
      sourceSummaries: sources,
    };
  },

  /**
   * Execute Administrative Action (Approve, Reject, Archive, Resolve Duplicate, Edit)
   */
  async performAdminAction(
    oppId: string,
    action: "approve" | "reject" | "archive" | "flag_duplicate" | "resolve_duplicate_keep" | "resolve_duplicate_merge",
    updates?: Partial<Opportunity>
  ): Promise<Opportunity> {
    try {
      const res = await fetch(`${PYTHON_FASTAPI_URL}/ingestion/opportunities/${oppId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, updates }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.opportunity;
      }
    } catch {
      // Fallback
    }

    const idx = inMemoryOpportunities.findIndex((o) => o.id === oppId);
    if (idx === -1) {
      throw new Error(`Opportunity ${oppId} not found`);
    }

    const target = { ...inMemoryOpportunities[idx] };
    if (action === "approve") {
      target.status = "published";
      target.validationErrors = [];
    } else if (action === "reject") {
      target.status = "rejected";
    } else if (action === "archive") {
      target.status = "archived";
    } else if (action === "flag_duplicate") {
      target.status = "flagged_duplicate";
    } else if (action === "resolve_duplicate_keep") {
      target.status = "published";
      delete target.duplicateOfId;
    } else if (action === "resolve_duplicate_merge") {
      target.status = "archived";
    }

    if (updates) {
      Object.assign(target, updates);
    }

    inMemoryOpportunities[idx] = target;
    return target;
  },

  /**
   * Helper to look up canonical original for duplicate comparison
   */
  getOriginalCandidate(duplicateOfId?: string): Opportunity | undefined {
    if (!duplicateOfId) return undefined;
    return inMemoryOpportunities.find((o) => o.id === duplicateOfId);
  }
};
