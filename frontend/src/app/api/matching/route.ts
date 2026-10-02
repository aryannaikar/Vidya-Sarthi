import { NextRequest, NextResponse } from "next/server";
import { matchingService, defaultStudentMatchingContext } from "@/lib/api/matchingService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentContext, filters, forceRefresh } = body || {};

    const response = await matchingService.getRecommendations(
      studentContext || defaultStudentMatchingContext,
      filters || {},
      forceRefresh || false
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Matching pipeline execution failed", details: String(error) },
      { status: 500 }
    );
  }
}
