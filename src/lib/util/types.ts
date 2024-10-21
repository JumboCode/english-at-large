import { Book, BookLevel, BookStatus, BookType } from "@prisma/client";
import { Request as BookRequest } from "@prisma/client";
import { User } from "@prisma/client";

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                                 BOOKS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

/**
 * Utility function for checking if a book is valid (no fields are empty, etc.)
 *
 * @param bookData - Partial book data to be validated.
 * @returns `true` if valid, otherwise false
 *
 * @remarks
 * - This function does **not** validate the `id` field. This is to account for
 *   cases where the ID has not been assigned yet (e.g., when creating a new book).
 */
export function validateBookData(bookData: Partial<Book>): boolean {
  // Don't validate ID since sometimes you'll need to have
  // TODO: add bookGroup back in
  const requiredFields = ["title", "isbn", "level"] as const;

  for (const field of requiredFields) {
    if (!bookData[field]) {
      return false;
    }
  }

  return true; // No errors
}

/**
 * "Empty book" with dummy data.
 */
export const emptyBook: Book = {
  id: 0, // Autoincremented, so can be 0 for dummy purposes
  title: "Untitled Book",
  author: "",
  isbn: "000-0-00-000000-0",
  publisher: "",
  level: BookLevel.Beginner,
  booktype: BookType.Reference,
  scanLink: "http://example.com/scan",
  description: "",
  notes: "",
  status: BookStatus.Available,
  skills: [],
  releaseDate: null,
};

/**
 * "Empty book" with dummy data.
 */
export const newEmptyBook: Omit<Book, "id"> = {
  title: "Untitled Book",
  author: "",
  isbn: "000-0-00-000000-0",
  publisher: "",
  level: BookLevel.Beginner,
  booktype: BookType.Reference,
  scanLink: "http://example.com/scan",
  description: "",
  notes: "",
  status: BookStatus.Available,
  skills: [],
  releaseDate: null,
};
////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                                 USERS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

export const emptyUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
  name: "Bob",
  email: "bob@gmail.com",
  role: "Admin",
};

export const newEmptyUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
  name: "U12",
  email: "u1@gmail.com",
  role: "Admin",
};

/**
 * Utility function for checking if a user is valid (no fields are empty, etc.)
 *
 * @param userData - Partial user data to be validated.
 * @returns `true` if valid, otherwise false
 *
 * @remarks
 * - This function does **not** validate the `id` field. This is to account for
 *   cases where the ID has not been assigned yet (e.g., when creating a new book).
 */

export function validateUserData(userData: Partial<User>): boolean {
  // Don't validate ID since sometimes you'll need to have
  // TODO: add bookGroup back in
  const requiredFields = ["name", "email", "role"] as const;

  for (const field of requiredFields) {
    if (!userData[field]) {
      return false;
    }
  }

  return true;
}
