import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Book } from "@prisma/client";
// import { validateBookData } from "@/lib/util/types";
import { deleteBookController, getAllBooksController, getOneBookController, postBookController, putBookController } from "./controller";

export async function GET(req: Request) {
  console.log("IN GET", req);
  try {
    const { searchParams } = new URL(req.url);
    const bookIdParam = searchParams.get('id'); // Assuming the ID is passed as a query parameter

    if (bookIdParam) {
      const bookId = Number(bookIdParam); // Convert the string to a number

      // Check if the conversion was successful
      if (isNaN(bookId)) {
        return NextResponse.json(
          { error: "Invalid book ID" },
          { status: 400 }
        );
      }

      // If a valid ID is provided, fetch a single book
      const book = await getOneBookController(bookId);
      if (!book) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(book);
    } else {
      // If no ID is provided, fetch all books
      const books = await getAllBooksController();
      return NextResponse.json(books);
    }
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
    // Omit excludes the requirement of 'id' field since it's generated by neon.tech
    const bookData: Omit<Book, "id"> = await req.json();
    // controller defined in controller.ts
    const newBook = postBookController(bookData);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    throw error; // throws error to the front end for better debugging, swap this out for below code
    // when passing to client

    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}

// PUT - Update a book
export async function PUT(req: Request) {
  try {
    const bookData: Book = await req.json();

    const updatedBook = putBookController(bookData);

    return NextResponse.json(updatedBook, {status: 200});
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
    const bookData: Book = await req.json();

    const deletedBook = deleteBookController(bookData);

    return NextResponse.json(deletedBook, {status: 200});
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
