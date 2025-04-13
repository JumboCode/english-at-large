import { NextResponse } from "next/server";
import { getCountController, getSubFoldersController } from "./controller";
// import { Invitation } from "@clerk/nextjs/dist/types/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const user = await getCountController(id);
      return NextResponse.json(user);
    } else {
      throw new Error("No folderID provided");
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch folder: ${error}` },
      { status: 500 }
    );
  }
}
