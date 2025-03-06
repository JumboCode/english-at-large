import { NextResponse } from "next/server";
import { Book } from "@prisma/client";
import {
  deleteBookController,
  getAllBooksController,
  getOneBookController,
  postBookController,
  putBookController,
} from "./controller";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookIdParam = searchParams.get("id"); // Assuming the ID is passed as a query parameter
    if (bookIdParam) {
      const bookId = Number(bookIdParam); // Convert the string to a number

      // Check if the conversion was successful
      if (isNaN(bookId)) {
        return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
      }

      // If a valid ID is provided, fetch a single book
      const book = await getOneBookController(bookId);
      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }
      return NextResponse.json(book);
    } else {
      // If no ID is provided, fetch all books
      const books = await getAllBooksController();
      return NextResponse.json(books);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch books: ${error}` },
      { status: 500 }
    );
  }
}

// POST - Create a new book
export async function POST(req: Request) {
  try {
    // Omit excludes the requirement of 'id' field since it's generated by neon.tech
    const bookData: Omit<Book, "id"> = await req.json();
    // controller defined in controller.ts
    const newBook = await postBookController(bookData);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to create book: ${error}` },
      { status: 500 }
    );
  }
}

// PUT - Update a book
export async function PUT(req: Request) {
  try {
    const bookData: Book = await req.json();
    const updatedBook = await putBookController(bookData);

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update book: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete a book
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookIdParam = searchParams.get("id");
    const bookId = Number(bookIdParam);

    const deletedBook = await deleteBookController(bookId);

    return NextResponse.json(deletedBook, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete book: ${error}` },
      { status: 500 }
    );
  }
}
