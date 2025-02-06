import { NextResponse } from "next/server";
import { Book, BookRequest, User } from "@prisma/client";
import {
  getOneRequestController,
  postRequestController,
  getAllRequestsController,
  putRequestController,
  deleteRequestController,
  getUserRequestController,
} from "./controller";

// GET - Fetch all requests
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  try {
    if (id) {
      // if id, fetch the specific user
      const request = await getOneRequestController(+id);
      return NextResponse.json(request);
    } else if (userId) {
      // if id, fetch the specific user
      const request = await getUserRequestController(userId);
      return NextResponse.json(request);

    } else {
      // if no id, fetch all users
      const requests: BookRequest[] = await getAllRequestsController();
      return NextResponse.json(requests);
    }
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch requests: ${error}` },
      { status: 500 }
    );
  }
}

// POST - Create a new request
export async function POST(req: Request) {
  try {
    // Omit excludes the requirement of 'id' field since it's generated by neon.tech
    const requestData: Omit<BookRequest, "id"> = await req.json();

    // controller defined in controller.ts
    const newRequest = await postRequestController(requestData);
    return NextResponse.json(newRequest);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create request: ${error}` },
      { status: 500 }
    );
  }
}

// PUT - Update a request
export async function PUT(req: Request) {
  try {
    const requestData: BookRequest & { user: User; book: Book } =
      await req.json();
    // controller defined in controllers.ts
    const updated = await putRequestController(requestData);

    return NextResponse.json(updated);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Failed to update request: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete a request
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") as string;
    //+id casts id from a string to a number
    const deletedRequest = await deleteRequestController(+id);

    return NextResponse.json(deletedRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete request: ${error}` },
      { status: 500 }
    );
  }
}
