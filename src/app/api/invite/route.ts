import { NextResponse } from "next/server";
import { getClerkUserController, postInviteController } from "./controller";

// POST - create new user
export async function POST(req: Request) {
  try {
    // Omit the requirement of 'id' field since it's generated by neon.tech
    const data = await req.json();
    const name = data["name"];
    const email = data["email"];
    const role = data["role"];
    const id = data["id"];

    // controller defined in controller.ts
    const invite = await postInviteController(name, email, role, id);
    return NextResponse.json({ invite }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send invite" },
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
