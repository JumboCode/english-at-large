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
