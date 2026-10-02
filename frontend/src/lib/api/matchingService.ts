import {
  MatchedOpportunity,
  StudentMatchingContext,
  MatchingFilterOptions,
  MatchingRecommendationResponse,
} from "@/types/matching";
import { Opportunity } from "@/types/opportunity";
import { opportunityService } from "@/lib/api/opportunityService";

const PYTHON_FASTAPI_URL =
  process.env.NEXT_PUBLIC_NLP_API_URL || "http://127.0.0.1:8000";

export const defaultStudentMatchingContext: StudentMatchingContext = {
  studentId: "student-aarav-01",
  fullName: "Aarav Sharma",
  degree: "B.Tech Computer Science and Engineering",
  college: "Indian Institute of Information Technology",
  graduatingYear: 2027,
  skills: [
    "TypeScript",
    "Go",
    "React",
    "Next.js",
    "PostgreSQL",
    "Docker",
    "Distributed Systems",
    "Linux",
  ],
  targetRoles: ["Systems & Distributed Backend Engineer", "Full-Stack Web Engineer"],
  preferredLocations: ["Bengaluru", "Hyderabad", "Remote"],
  preferredWorkModes: ["hybrid", "remote"],
  opportunityTypePreference: "all",
};

// In-memory cache to avoid repeated heavy computation on rapid rerenders
let cachedRecommendations: MatchedOpportunity[] | null = null;
let lastContextKey: string | null = null;

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function computeClientMatch(
  context: StudentMatchingContext,
  opp: Opportunity
): MatchedOpportunity {
  const studentSkills = context.skills.map(normalize);
  const reqSkills = (opp.requiredSkills || []).map((s) => s.trim());
  const prefSkills = (opp.preferredSkills || []).map((s) => s.trim());

  // 1. Skill Overlap (Weight 40%)
  const matchedReq = reqSkills.filter((s) => studentSkills.includes(normalize(s)));
  const matchedPref = prefSkills.filter((s) => studentSkills.includes(normalize(s)));
  const missingReq = reqSkills.filter((s) => !studentSkills.includes(normalize(s)));

  let skillScore = 0.5;
  if (reqSkills.length > 0) {
    const base = matchedReq.length / reqSkills.length;
    const bonus = Math.min(0.2, matchedPref.length * 0.1);
    skillScore = Math.min(1.0, base + bonus);
  }

  // 2. Semantic & Role Alignment (Weight 25%)
  const oppTitle = opp.title.toLowerCase();
  let roleScore = 0.5;
  for (const role of context.targetRoles) {
    const roleWords = role.toLowerCase().split(/\s+/);
    if (roleWords.some((w) => w.length > 3 && oppTitle.includes(w))) {
      roleScore = Math.max(roleScore, 0.95);
    } else if (
      oppTitle.includes("software") ||
      oppTitle.includes("engineer") ||
      oppTitle.includes("intern")
    ) {
      roleScore = Math.max(roleScore, 0.75);
    }
  }

  // 3. Location / Work Mode (Weight 15%)
  let locationScore = 0.5;
  if (opp.workMode === "remote") {
    locationScore = 1.0;
  } else {
    const oppLoc = opp.location.toLowerCase();
    for (const pref of context.preferredLocations) {
      if (oppLoc.includes(pref.toLowerCase())) {
        locationScore = 0.95;
        break;
      }
    }
  }

  // 4. Academic & Graduation Year Compatibility (Weight 20%)
  let expScore = 0.8;
  const oppElig = (opp.eligibility || "").toLowerCase();
  const gradYearStr = String(context.graduatingYear || 2027);
  if (oppElig.includes(gradYearStr) || oppElig.includes("college") || oppElig.includes("undergraduate")) {
    expScore = 1.0;
  } else if (opp.experienceLevel === "student" || opp.experienceLevel === "fresher") {
    expScore = 0.9;
  }

  // Weighted Formula: 40% skills + 25% role + 15% location + 20% experience
  const rawScore = (skillScore * 0.40) + (roleScore * 0.25) + (locationScore * 0.15) + (expScore * 0.20);
  const relevanceScore = Math.min(99, Math.max(45, Math.round(rawScore * 100)));

  const relevanceTier =
    relevanceScore >= 85 ? "exceptional" : relevanceScore >= 70 ? "strong" : "moderate";

  // Eligibility Check (Strict separation from relevance score)
  let eligibilityStatus: "confirmed_eligible" | "likely_eligible" | "unconfirmed" = "confirmed_eligible";
  let eligibilityNotes = `Meets criteria for ${gradYearStr} graduation cohort (${opp.eligibility || "Standard University Criteria"})`;

  if (oppElig.includes("final year") && (context.graduatingYear || 2027) > 2026) {
    eligibilityStatus = "likely_eligible";
    eligibilityNotes = "Requires final-year standing; verify eligibility at registration";
  }

  const allMatched = [...matchedReq, ...matchedPref];
  const matchedSummary = allMatched.length > 0 ? allMatched.slice(0, 3).join(", ") : "core computing background";

  return {
    opportunity: opp,
    relevanceScore,
    relevanceTier,
    eligibilityStatus,
    eligibilityNotes,
    matchRationale: `Demonstrated competency in ${matchedSummary}. Directly aligns with your target direction in ${context.targetRoles[0]} and preferred ${opp.workMode} setup.`,
    matchedSkills: allMatched,
    missingSkills: missingReq,
    interestAlignment: `Target role match: ${context.targetRoles[0]}`,
    workModeAlignment: `${opp.workMode.toUpperCase()} (${opp.location})`,
    suggestedAction: `Emphasize your hands-on experience in ${allMatched[0] || "relevant technical coursework"} when applying`,
  };
}

export const matchingService = {
  /**
   * Get personalized recommendations for student
   */
  async getRecommendations(
    customContext?: Partial<StudentMatchingContext>,
    filters: MatchingFilterOptions = {},
    forceRefresh: boolean = false
  ): Promise<MatchingRecommendationResponse> {
    const context: StudentMatchingContext = {
      ...defaultStudentMatchingContext,
      ...customContext,
    };

    const contextKey = JSON.stringify({
      skills: context.skills,
      targetRoles: context.targetRoles,
      locations: context.preferredLocations,
      gradYear: context.graduatingYear,
    });

    if (!forceRefresh && cachedRecommendations && lastContextKey === contextKey) {
      let filtered = [...cachedRecommendations];
      if (filters.type && filters.type !== "all") {
        filtered = filtered.filter((m) => m.opportunity.type === filters.type);
      }
      if (filters.minScore) {
        filtered = filtered.filter((m) => m.relevanceScore >= (filters.minScore || 0));
      }
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.opportunity.title.toLowerCase().includes(q) ||
            m.opportunity.company.toLowerCase().includes(q) ||
            m.matchedSkills.some((s) => s.toLowerCase().includes(q))
        );
      }
      return {
        success: true,
        totalMatches: filtered.length,
        studentContext: context,
        matches: filtered,
        calculatedAt: new Date().toISOString(),
      };
    }

    // Try Python FastAPI matching engine first
    try {
      const res = await fetch(`${PYTHON_FASTAPI_URL}/matching/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: context.studentId,
          fullName: context.fullName,
          degree: context.degree,
          graduatingYear: context.graduatingYear,
          skills: context.skills,
          targetRoles: context.targetRoles,
          preferredLocations: context.preferredLocations,
          preferredWorkModes: context.preferredWorkModes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          cachedRecommendations = data.matches;
          lastContextKey = contextKey;
          return {
            success: true,
            totalMatches: data.matches.length,
            studentContext: context,
            matches: data.matches,
            calculatedAt: new Date().toISOString(),
          };
        }
      }
    } catch {
      // Graceful fallback to client-side multi-signal matching
    }

    // Compute client-side using published opportunities pool
    const publishedOpps = await opportunityService.getStudentOpportunities();
    const ranked = publishedOpps.map((opp) => computeClientMatch(context, opp));
    ranked.sort((a, b) => b.relevanceScore - a.relevanceScore);

    cachedRecommendations = ranked;
    lastContextKey = contextKey;

    let filtered = [...ranked];
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter((m) => m.opportunity.type === filters.type);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.opportunity.title.toLowerCase().includes(q) ||
          m.opportunity.company.toLowerCase().includes(q) ||
          m.matchedSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      totalMatches: filtered.length,
      studentContext: context,
      matches: filtered,
      calculatedAt: new Date().toISOString(),
    };
  },

  /**
   * Helper for conversational guidance in AI Career Assistant
   */
  async queryCareerAssistant(
    prompt: string,
    context?: StudentMatchingContext
  ): Promise<{
    answer: string;
    relevantMatches: MatchedOpportunity[];
    recommendedSkills: string[];
    suggestedFollowUps: string[];
  }> {
    const student = context || defaultStudentMatchingContext;
    const { matches } = await this.getRecommendations(student);
    const topMatches = matches.slice(0, 3);

    const promptLower = prompt.toLowerCase();
    let answer = "";
    let recommendedSkills: string[] = [];
    const suggestedFollowUps: string[] = [
      "What projects can I build to highlight distributed systems skills?",
      "How do I optimize my resume for Razorpay graduate engineer roles?",
      "Compare my readiness for Frontend vs Backend tracks.",
    ];

    // 1. Try Gemini AI route first
    try {
      const res = await fetch("/api/career-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          studentContext: student,
          topMatches,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.answer) {
          answer = data.answer;
        }
      }
    } catch {
      // Offline fallback
    }

    // 2. Grounded deterministic fallback if Gemini returned empty
    if (!answer) {
      if (promptLower.includes("gap") || promptLower.includes("skill") || promptLower.includes("zerodha") || promptLower.includes("systems")) {
        const allMissing = Array.from(new Set(topMatches.flatMap((m) => m.missingSkills)));
        recommendedSkills = allMissing.slice(0, 3);
        if (recommendedSkills.length === 0) recommendedSkills = ["Kafka", "System Design", "Redis"];

        answer = `Based on your analyzed profile (${student.degree}) and target role (${student.targetRoles[0]}), your verified strengths in **${student.skills.slice(0, 3).join(", ")}** provide a strong foundation. To maximize competitiveness for high-throughput systems roles, prioritize developing **${recommendedSkills.join(", ")}**. Building a practical project like an event-driven task queue with persistent WAL logs will bridge this gap effectively.`;
      } else if (promptLower.includes("interview") || promptLower.includes("scenario") || promptLower.includes("react")) {
        answer = `Here are 3 technical interview scenarios grounded directly in your coursework and project evidence:
1. **Concurrency & Thread Safety:** How would you implement worker pools in Go with graceful shutdown and channel backpressure?
2. **State Management & Web Vitals:** When rendering large data tables in Next.js, how do you prevent layout shifts and eliminate re-renders?
3. **Database Indexing:** In PostgreSQL, explain the trade-offs between B-tree and BRIN indexes for append-heavy telemetry logs.`;
      } else {
        answer = `Analyzing your profile against our active opportunity collection: We found **${topMatches.length} high-relevance opportunities** aligned with your preferences. The strongest match is **${topMatches[0]?.opportunity.title || "Graduate Software Engineer"}** at **${topMatches[0]?.opportunity.company || "Razorpay"}** with a **${topMatches[0]?.relevanceScore || 92}% relevance estimate**, driven by your verified skills in ${topMatches[0]?.matchedSkills.join(", ") || "Go and Distributed Systems"}.`;
      }
    }

    return {
      answer,
      relevantMatches: topMatches,
      recommendedSkills,
      suggestedFollowUps,
    };
  },
};
