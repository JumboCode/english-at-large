import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import {
  getAllUsersController, postUserController, putUserController,
  deleteUserController, getOneUserController
} from "./controller";

// GET - retrieve all users or single user by ID
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      // if id, fetch the specific user
      try {
        const user = await getOneUserController(id)
        return NextResponse.json(user);
      } catch {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

    } else {
      // if no id, fetch all users
      const users: User[] = await getAllUsersController()
      return NextResponse.json(users);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - create new user
export async function POST(req: Request) {
  try {
    // Omit the requirement of 'id' field since it's generated by neon.tech
    const userData: Omit<User, "id"> = await req.json();

    // controller defined in controller.ts
    const newUser = postUserController(userData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - update user
export async function PUT(req: Request) {
  try {
    const userData: User = await req.json();
    const updatedUser = putUserController(userData)
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - delete user by id
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // if id, delete the specific user
      try {
        await deleteUserController(id);
        return NextResponse.json(
          { message: "User deleted successfully" },
          { status: 200 });
      } catch {
        return NextResponse.json(
          { error: "ID not found" },
          { status: 400 }
        );
      }

    } else {
      return NextResponse.json(
        { error: "No ID provided" },
        { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
