import { prisma } from "@/lib/prisma";
import { getAvailableCopies, validateBookData } from "@/lib/util/types";
import { Book, BookRequest } from "@prisma/client";
/**
 * Utility controller that validates book fields, then creates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postBookController = async (
  bookData: Omit<Book, "id">
): Promise<Book> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  try {
    if (!validateBookData(bookData)) {
      throw new Error("Missing required book properties");
    }
    const newBook = await prisma.book.create({
      data: bookData,
      include: {
        requests: true,
      },
    });

    if (getAvailableCopies(newBook) < 0) {
      throw new Error(
        `Invariant violated: Available copies are below 0 for ${newBook.title} : ${newBook.id}`
      );
    }

    return newBook;
  } catch (error) {
    console.error("Error Posting Books: ", error);
    throw error;
  }
};

export const getAllBooksController = async (): Promise<Book[]> => {
  try {
    const Books = await prisma.book.findMany({
      include: {
        requests: true,
      },
    });

    let failedBook: Book | null = null;

    Books.map((book) => {
      failedBook = book;

      if (getAvailableCopies(book) < 0) {
        throw new Error(
          `Invariant violated: Available copies are below 0 for ${failedBook.title} : ${failedBook.id}`
        );
      }
    });

    return Books;
  } catch (error) {
    console.error("Error fetching books: ", error);
    throw error;
  }
};

export const getOneBookController = async (bookId: number): Promise<Book> => {
  try {
    if (bookId === undefined || bookId === null) {
      throw new Error("Missing book id");
    }

    const findBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        requests: true,
      },
    });

    if (findBook && getAvailableCopies(findBook) < 0) {
      throw new Error(
        `Invariant violated: Available copies are below 0 for ${findBook.title} : ${findBook.id}`
      );
    }

    if (findBook) return findBook;
    else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error fetching book: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData
 * @remarks
 *  - N/A
 */
export const putBookController = async (bookData: Book): Promise<Book> => {
  try {
    if (!bookData.id || !validateBookData(bookData)) {
      throw new Error("Missing id, and name or owner");
    }

    if (getAvailableCopies(bookData) < 0) {
      throw new Error(
        `Invariant violated: cannot update book to have less than 0 available copies: ${bookData.title} : ${bookData.id}`
      );
    }

    const bookWithRequests = bookData as Book & { requests: BookRequest[] };

    const { requests, ...updatedBookData } = bookWithRequests;
    void requests;

    const updatedBook = await prisma.book.update({
      where: { id: updatedBookData.id },
      data: updatedBookData,
      include: {
        requests: true,
      },
    });

    if (updatedBook) {
      if (getAvailableCopies(updatedBook) < 0) {
        throw new Error(
          `Invariant violated: book updated to have less than 0 availlable copies: ${updatedBook.title} : ${updatedBook.id}`
        );
      }
      return updatedBook;
    } else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error Putting Book: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData
 * @remarks
 *  - N/A
 */
export const deleteBookController = async (bookId: number): Promise<Book> => {
  try {
    if (bookId === null || bookId === undefined) throw new Error("Invalid ID");

    const deletedBook = await prisma.book.delete({
      where: { id: bookId },
    });

    if (deletedBook) return deletedBook;
    else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error deleting book", error);
    throw error;
  }
};
