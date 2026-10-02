import { NextRequest, NextResponse } from "next/server";

const ROLE_BENCHMARKS: Record<
  string,
  {
    core: string[];
    recommended: string[];
    projectIdeas: string[];
  }
> = {
  "Software Development Engineer - Frontend": {
    core: ["typescript", "react", "next.js", "tailwind css", "javascript"],
    recommended: ["testing", "system design", "performance optimization", "graphql"],
    projectIdeas: [
      "Build an accessible UI design system with documentation and Storybook",
      "Implement a virtualized data table supporting 100k+ rows with zero frame drops",
    ],
  },
  "Systems & Distributed Backend Engineer": {
    core: ["go", "postgresql", "linux", "distributed systems", "docker", "c++"],
    recommended: ["kubernetes", "redis", "kafka", "system design", "grpc"],
    projectIdeas: [
      "Implement a distributed key-value store using Raft consensus",
      "Build an HTTP/2 reverse proxy with round-robin health-checking and metrics",
    ],
  },
  "Full-Stack Web Engineer": {
    core: ["typescript", "react", "node.js", "postgresql", "next.js"],
    recommended: ["docker", "redis", "restful api development", "tailwind css"],
    projectIdeas: [
      "Create an end-to-end multi-tenant SaaS application with Supabase authentication",
      "Develop an event-driven task queue with retry mechanisms and dead-letter queues",
    ],
  },
  "AI / Machine Learning Engineer": {
    core: ["python", "pytorch", "tensorflow", "sql", "pandas"],
    recommended: ["docker", "fastapi", "system design", "distributed systems"],
    projectIdeas: [
      "Fine-tune a lightweight LLM on domain-specific documentation using LoRA",
      "Build a real-time semantic search engine using vector embeddings and Redis",
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetRole = "Software Development Engineer - Frontend", studentSkills = [] } = body;

    const benchmark =
      ROLE_BENCHMARKS[targetRole] ||
      ROLE_BENCHMARKS["Software Development Engineer - Frontend"];

    const studentLower = studentSkills.map((s: string) => s.toLowerCase());

    const supportedSkills = benchmark.core
      .filter((s) => studentLower.includes(s))
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

    const skillGaps = benchmark.core
      .filter((s) => !studentLower.includes(s))
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

    const recommendedToAcquire = [
      ...skillGaps,
      ...benchmark.recommended
        .filter((s) => !studentLower.includes(s))
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    ];

    const rationale = `Based on your profile evidence, you have validated competency in ${
      supportedSkills.slice(0, 3).join(", ") || "fundamental engineering concepts"
    }. To be strongly competitive for ${targetRole} positions, prioritizing ${
      recommendedToAcquire.slice(0, 2).join(" and ")
    } will strengthen your technical alignment.`;

    return NextResponse.json({
      targetRole,
      supportedSkills,
      recommendedSkillsToAcquire: recommendedToAcquire,
      rationale,
      suggestedProjectAreas: benchmark.projectIdeas,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate career insights", details: String(error) },
      { status: 500 }
    );
  }
}
