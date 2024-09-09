import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all books
export async function GET() {
  try {
    const books = await prisma.book.findMany();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST - Create a new book
export async function POST(req: Request) {
  try {
    const { name, owner } = await req.json();

    if (!name || !owner) {
      return NextResponse.json(
        { error: "Missing name or owner" },
        { status: 400 }
      );
    }

    const newBook = await prisma.book.create({
      data: {
        name,
        owner,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}

// PUT - Update a book
export async function PUT(req: Request) {
  try {
    const { id, name, owner } = await req.json();

    if (!id || (!name && !owner)) {
      return NextResponse.json(
        { error: "Missing id, and name or owner" },
        { status: 400 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        name,
        owner,
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a book
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.book.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
