import { NextRequest, NextResponse } from "next/server";
import { opportunityService } from "@/lib/api/opportunityService";
import { OpportunityType } from "@/types/opportunity";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const oppType = searchParams.get("type") as OpportunityType | "all" | null;
  const searchQuery = searchParams.get("q") || undefined;

  try {
    const opportunities = await opportunityService.getStudentOpportunities({
      type: oppType || undefined,
      searchQuery: searchQuery || undefined,
    });

    return NextResponse.json({
      total: opportunities.length,
      opportunities,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load published opportunities", details: String(error) },
      { status: 500 }
    );
  }
}
