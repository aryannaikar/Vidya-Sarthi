import { NextRequest, NextResponse } from "next/server";
import { opportunityService } from "@/lib/api/opportunityService";
import { OpportunityFilters, OpportunityStatus, OpportunityType } from "@/types/opportunity";

function checkAdminAccess(req: NextRequest): boolean {
  const roleHeader = req.headers.get("x-user-role");
  const authHeader = req.headers.get("authorization");
  return roleHeader === "admin" || (!!authHeader && authHeader.includes("admin"));
}

export async function GET(req: NextRequest) {
  if (!checkAdminAccess(req)) {
    return NextResponse.json(
      { error: "Forbidden: Platform administration rights required.", code: "UNAUTHORIZED_ADMIN_ACCESS" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") as OpportunityStatus | "all" | null;
  const oppType = searchParams.get("type") as OpportunityType | "all" | null;
  const source = searchParams.get("source") || undefined;
  const searchQuery = searchParams.get("q") || undefined;

  const filters: OpportunityFilters = {
    status: status || undefined,
    type: oppType || undefined,
    source: source || undefined,
    searchQuery: searchQuery || undefined,
  };

  try {
    const data = await opportunityService.getAdminOpportunities(filters);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve administrative opportunities", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminAccess(req)) {
    return NextResponse.json(
      { error: "Forbidden: Platform administration rights required.", code: "UNAUTHORIZED_ADMIN_ACCESS" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { oppId, action, updates } = body;

    if (!oppId || !action) {
      return NextResponse.json(
        { error: "Missing required parameters: oppId and action are mandatory." },
        { status: 400 }
      );
    }

    const updated = await opportunityService.performAdminAction(oppId, action, updates);
    return NextResponse.json({
      success: true,
      opportunity: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Administrative action failed", details: String(error) },
      { status: 500 }
    );
  }
}
