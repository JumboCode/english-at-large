import { Book } from "@prisma/client";
import axios from "axios";

/**
 * Utility function for fetching all books
 *
 * @param none
 * @returns array of books (of type Books)
 *
 * @remarks
 */
export const getAllBooks = async (): Promise<Book[] | undefined> => {
  try {
    const response = await axios.get("/api/books");
    return response.data; //JSOn
  } catch (error) {
    throw new Error("Failed to fetch books");
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
export const getOneBook = async (bookId: number): Promise<Book | undefined> => {
  try {
    const response = await axios.get(`/api/books/?id=${bookId}`); // Using template literals for cleaner URL construction
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch books");
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
): Promise<Book | undefined> => {
  try {
    const response = await axios.post("/api/books", book);
    console.log(response);
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
export const updateBook = async (book: Book): Promise<Book | undefined> => {
  try {
    const response = await axios.put("/api/books", book);
    return response.data;
  } catch (error) {
    console.error("Failed to create book: ", error);
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
export const deleteBook = async (bookId: number): Promise<Book | undefined> => {
  try {
    const response = await axios.delete(`/api/books?id=${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to create book: ", error);
  }
};
