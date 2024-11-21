import { NextResponse } from "next/server";
import { getClerkUserController, postInviteController } from "./controller";
import { Invitation } from "@clerk/nextjs/dist/types/server";

// POST - create new user.
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const name = data["name"];
    const email = data["email"];
    const role = data["role"];
    // neon tech ID, created to track users before they fully accept the invite.
    // used to update the 'pending' state of the user when invite is accepted.
    const id = data["id"];

    // controller defined in controller.ts
    const invite: Invitation = await postInviteController(
      name,
      email,
      role,
      id
    );
    return NextResponse.json({ invite }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send invite: " + error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const user = await getClerkUserController(id);
      return NextResponse.json(user);
    } else {
      throw new Error("No UserID provided");
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch clerk user: ${error}` },
      { status: 500 }
    );
  }
}
