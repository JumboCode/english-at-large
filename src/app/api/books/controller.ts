import { prisma } from "@/lib/prisma";
import { validateBookData } from "@/lib/util/types";
import { Book } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Utility controller that validates book fields, then creates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postBookController = async (bookData: Omit<Book, "id">) => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  if (!validateBookData(bookData)) {
    return NextResponse.json(
      { error: "Missing required book properties" },
      { status: 400 }
    );
  }

  const newBook = await prisma.book.create({
    data: bookData,
  });

  return newBook;
};

export const getOneBookController = async (bookId: number) => {
  console.log("in putBookController");
  if (!bookId) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  const findBook = await prisma.book.findUnique({
    where: { id: bookId }
  });

  return findBook;
}


export const putBookController = async (bookData: Book) => {
    console.log("in putBookController");
    if (!bookData.id || !validateBookData(bookData)) {
      return NextResponse.json(
        { error: "Missing id, and name or owner" },
        { status: 400 }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookData.id },
      data: bookData,
    });

    return updatedBook;
}

export const deleteBookController = async (bookData: Book) => {
  console.log("in deleteBookController");

    if (!bookData.id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.book.delete({
      where: { id: bookData.id },
    });

    return NextResponse.json({ message: "Book deleted successfully" });
    
}