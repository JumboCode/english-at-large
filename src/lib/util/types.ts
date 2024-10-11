import { Book, BookLevel, BookStatus, BookType } from "@prisma/client";

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



////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                              REQUESTS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

/**
 * Utility function for checking if a request is valid (no fields are empty, etc.)
 *
 * @param requestData - Partial request data to be validated.
 * @returns `true` if valid, otherwise false
 *
 * @remarks
 * - This function does **not** validate the `id` field. This is to account for
 *   cases where the ID has not been assigned yet (e.g., when creating a new book).
 */
export function validateRequestData(requestData: Partial<Book>): boolean {
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
      