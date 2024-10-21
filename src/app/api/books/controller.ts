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
  try {
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
  } catch (error) {
    console.error("Eror Posting Books: ", error);
    throw error;
  }
};

export const getAllBooksController = async () => {
  try {
    const Books = await prisma.book.findMany()
    return Books;
  } catch(error) {
    console.error("Error fetching books: ", error);
    throw error;
  }
}

export const getOneBookController = async (bookId: number) => {
  try {
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
  } catch (error) {
    console.error("Error fetching book: ", error);
    throw error;
  }
}

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData
 * @remarks
 *  - N/A
 */
export const putBookController = async (bookData: Book) => {
  try {
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
  } catch(error) {
    console.error("Error Putting Book: ", error);
  }
}

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData
 * @remarks
 *  - N/A
 */
export const deleteBookController = async (bookId: number) => {
  try {
    if (!bookId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book", error);
    throw error;
  }
}