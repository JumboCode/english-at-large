import { NextResponse } from "next/server";
import { requireUserWithRole } from "@/lib/auth";
import { getRequestsCountController } from "./controller";

// GET - Fetch all requests
export async function GET(req: Request) {
  try {
    await requireUserWithRole(["Admin"]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    // grab the date ranges
    const { searchParams } = new URL(req.url);

    const fromDateStr = searchParams.get("fromDate");
    const endDateStr = searchParams.get("endDate");

    const fromDate = fromDateStr ? new Date(fromDateStr) : undefined;
    const endDate = endDateStr ? new Date(endDateStr) : undefined;

    if (
      (fromDate && isNaN(fromDate.getTime())) ||
      (endDate && isNaN(endDate.getTime()))
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const effectiveFromDate = fromDate ?? new Date(0);
    const effectiveEndDate = endDate ?? new Date();
    const numRequests: number = await getRequestsCountController(
      effectiveFromDate,
      effectiveEndDate
    );
    return NextResponse.json(numRequests);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch request count: ${error}` },
      { status: 500 }
    );
  }
}
