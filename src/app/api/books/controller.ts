import { prisma } from "@/lib/prisma";
import { BookWithRequests, validateBookData } from "@/lib/util/types";
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
): Promise<BookWithRequests> => {
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

    return newBook;
  } catch (error) {
    console.error("Error Posting Books: ", error);
    throw error;
  }
};

//OLD

// export const getAllBooksController = async (): Promise<BookWithRequests[]> => {
//   try {
//     const Books = await prisma.book.findMany({
//       include: {
//         requests: true,
//       },
//     });

//     return Books;
//   } catch (error) {
//     console.error("Error fetching books: ", error);
//     throw error;
//   }
// };

//NEW
export const getAllBooksController = async (
  page: number = 1,
  limit: number = 10
): Promise<{ books: BookWithRequests[]; total: number; totalPages: number }> => {
  try {
    console.log("API Handler - Page:", page, "Limit:", limit);
    // Calculate the offset (skip) for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated books and total count
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        skip: skip,
        take: limit,
        include: {
          requests: true, // Include related requests
        },
      }),
      prisma.book.count(), // Get the total number of books
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return { books, total, totalPages };
  } catch (error) {
    console.error("Error fetching books: ", error);
    throw error;
  }
};

export const getOneBookController = async (
  bookId: number
): Promise<BookWithRequests> => {
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
export const putBookController = async (
  bookData: BookWithRequests
): Promise<BookWithRequests> => {
  try {
    if (!bookData.id || !validateBookData(bookData)) {
      throw new Error("Missing id, and name or owner");
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
