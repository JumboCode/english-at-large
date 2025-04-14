import { NextResponse } from "next/server";
import { getCountController, getSubFoldersController } from "./controller";
// import { Invitation } from "@clerk/nextjs/dist/types/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (id) {
      let response;
      if (type === "count") {
        response = await getCountController(id);
      } else if (type === "sub") {
        response = await getSubFoldersController(id);
      }
      return NextResponse.json(response);
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
