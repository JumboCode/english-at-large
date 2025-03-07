import { NextResponse } from "next/server";
import { getRequestsCountController } from "./controller";

// GET - Fetch all requests
export async function GET() {
  try {
    // if no id, fetch all users
    const numRequests: number = await getRequestsCountController();
    return NextResponse.json(numRequests);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch request count: ${error}` },
      { status: 500 }
    );
  }
}
