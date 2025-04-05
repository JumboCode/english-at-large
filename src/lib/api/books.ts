import axios from "axios";
import { BookStats, BookWithRequests } from "../util/types";
import { Book } from "@prisma/client";

/**
 * Utility function for fetching all books
 *
 * @param from
 * @param to
 * @returns array of books (of type Books)
 *
 * @remarks
 */

//OLD
// export const getAllBooks = async (): Promise<
//   BookWithRequests[] | undefined
// > => {
//   try {
//     const response = await axios.get("/api/books");
//     return response.data; //JSOn
//   } catch (error) {
//     if (error instanceof Error) {
//       throw new Error(`Failed to fetch books: ${error.message}`);
//     } else {
//       throw new Error("Failed to fetch books: An unknown error occurred");
//     }
//   }
// };

export const getAllBooks = async (options?: {
  page?: number;
  limit?: number;
  withStats?: boolean;
  fromDate?: Date;
  endDate?: Date;
}): Promise<
  | {
      books: (BookWithRequests | (BookWithRequests & BookStats))[];
      total: number;
      totalPages: number;
    }
  | undefined
> => {
  try {
    const { page, limit, withStats = false, fromDate, endDate } = options || {};

    const response = await axios.get(`/api/books`, {
      params: {
        page: page,
        limit: limit,
        withStats: withStats,
        fromDate: fromDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    });

    return response.data; // The response should include books, total, and totalPages
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    } else {
      throw new Error("Failed to fetch books: An unknown error occurred");
    }
  }
};

/**
 * Utility function for fetching one books
 *
 * @param bookId
 * @returns one book (of type Books)
 *
 * @remarks
 */
export const getOneBook = async (
  bookId: number
): Promise<BookWithRequests | undefined> => {
  try {
    const response = await axios.get(`/api/books/?id=${bookId}`); // Using template literals for cleaner URL construction
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch book: ${error.message}`);
    } else {
      throw new Error("Failed to fetch book: An unknown error occurred");
    }
  }
};

/**
 * Utility function for creating a books
 *
 * @param book WITHOUT an id field - this will be generated when posting
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const createBook = async (
  book: Omit<Book, "id">
): Promise<BookWithRequests | undefined> => {
  try {
    const response = await axios.post("/api/books", book);
    return response.data;
  } catch (error) {
    console.error("Failed to create book: ", error);
  }
};

/**
 * Utility function for updating a book
 *
 * @param book
 * @returns the updated book
 *
 * @remarks
 */
export const updateBook = async (
  book: BookWithRequests | Book
): Promise<BookWithRequests | undefined> => {
  try {
    const response = await axios.put("/api/books", book);
    return response.data;
  } catch (error) {
    console.error("Failed to update book: ", error);
  }
};

/**
 * Utility function for deleting a book
 *
 * @param bookId
 * @returns nothing
 *
 * @remarks
 */
export const deleteBook = async (
  bookId: number
): Promise<BookWithRequests | undefined> => {
  try {
    const response = await axios.delete(`/api/books?id=${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete book: ", error);
  }
};

const DEFAULT_IMAGE =
  "https://drive.google.com/file/d/16AqCXCMmHGEN1kLqjaGe2DYKEQEyhIMk/view?usp=drive_link";

export const getBookCover = async (
  bookISBN: string
): Promise<string | undefined> => {
  const url = `https://covers.openlibrary.org/b/isbn/${bookISBN}-M.jpg`;

  try {
    const response = await axios.head(url);
    if (response.status == 200) {
      return url;
    }
  } catch (error) {
    console.warn("Error fetching image", error);
  }

  return DEFAULT_IMAGE;
};
