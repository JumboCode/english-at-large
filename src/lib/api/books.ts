import { Book } from "@prisma/client";
import axios, { AxiosRequestConfig } from "axios";
import { validateBookData } from "../util/types";

/**
 * Utility function for fetching all books
 *
 * @param none
 * @returns array of books (of type Books)
 *
 * @remarks
 * - TODO: add filtering if needed
 */
export async function getBooks() {
  try {
    const response = await axios.get("/api/books");
    return response.data; //JSOn
  } catch (error) {
    throw new Error("Failed to fetch books");
  }
}

export async function getOneBook(bookId: number) {
  console.log("getOneBook in books");
  try {
    const response = await axios.get(`/api/books/?id=${bookId}`); // Using template literals for cleaner URL construction
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch books");
  }
}


/**
 * Utility function for creating a books
 *
 * @param book WITHOUT an id field - this will be generated when posting
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function createBook(book: Omit<Book, "id">) {
  try {
    if (!validateBookData(book)) {
      throw new Error("Missing book fields");
    }
    const response = await axios.post("/api/books", book);
    return response.data;
  } catch (error) {
    console.error("Failed to create book: ", error);
  }
}

export async function updateBook(book: Book) {
  try {
    if (!validateBookData(book)) {
      throw new Error("Missing book fields");
    }
    // alert("Book update successfully!");
    const response = await axios.put("/api/books", book);
    return response.data;
  } catch (error) {
    console.error("Failed to create book: ", error);
  }
}

export async function deleteBook(book: Book) {
  try {
    if (!validateBookData(book)) {
      throw new Error("Missing book fields");
    }

    const config: AxiosRequestConfig = {
      data: book,
    };
    
    // alert("Book update successfully!");
    const response = await axios.delete("/api/books", config);
    return response.data;
  } catch (error) {
    console.error("Failed to create book: ", error);
  }
}


// Add other CRUD functions as needed (updateBook, deleteBook, etc.)
