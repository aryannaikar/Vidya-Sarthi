import { NextRequest, NextResponse } from "next/server";
import { opportunityService } from "@/lib/api/opportunityService";

// Administrative Access Authorization Helper
function checkAdminAccess(req: NextRequest): boolean {
  const roleHeader = req.headers.get("x-user-role");
  const authHeader = req.headers.get("authorization");
  // Allow if x-user-role is admin or authorization bearer token present
  return roleHeader === "admin" || (!!authHeader && authHeader.includes("admin"));
}

export async function GET(req: NextRequest) {
  // Backend role enforcement
  if (!checkAdminAccess(req)) {
    return NextResponse.json(
      {
        error: "Forbidden: Platform administration rights required.",
        code: "UNAUTHORIZED_ADMIN_ACCESS"
      },
      { status: 403 }
    );
  }

  try {
    const metrics = await opportunityService.getIngestionMetrics();
    const sources = await opportunityService.getSourceSummaries();
    return NextResponse.json({
      metrics,
      sources,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to query ingestion metrics", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Backend role enforcement
  if (!checkAdminAccess(req)) {
    return NextResponse.json(
      {
        error: "Forbidden: Platform administration rights required to trigger collection.",
        code: "UNAUTHORIZED_ADMIN_ACCESS"
      },
      { status: 403 }
    );
  }

  try {
    const result = await opportunityService.triggerIngestionPipeline();
    return NextResponse.json({
      success: true,
      result
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Ingestion pipeline run encountered an exception", details: String(error) },
      { status: 500 }
    );
  }
}
