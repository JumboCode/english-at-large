// import { NextResponse } from "next/server";
// import { getClerkUserController, postInviteController } from "./controller";
// // import { Invitation } from "@clerk/nextjs/dist/types/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     if (id) {
//       const user = await getClerkUserController(id);
//       return NextResponse.json(user);
//     } else {
//       throw new Error("No UserID provided");
//     }
//   } catch (error) {
//     return NextResponse.json(
//       { error: `Failed to fetch clerk user: ${error}` },
//       { status: 500 }
//     );
//   }
// }
