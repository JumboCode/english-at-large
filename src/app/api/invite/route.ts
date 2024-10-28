import { NextResponse } from "next/server";
import { postInviteController } from "./controller";


// POST - create new user
export async function POST(req: Request) {
    try {
      // Omit the requirement of 'id' field since it's generated by neon.tech
      const data = await req.json();
      const name = data["name"];
      const email = data["email"];
      const role = data["role"];
        
      // controller defined in controller.ts
      const invite = await postInviteController(name, email, role);
      return NextResponse.json(invite, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to send invite" },
        { status: 500 }
      );
    }
  }
