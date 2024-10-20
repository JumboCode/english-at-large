import { Book, BookLevel, BookStatus, BookType } from "@prisma/client";
import { Request as BookRequest} from "@prisma/client";

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
 * "Empty book" with dummy data.
 */
export const emptyRequest: BookRequest = {
    id: 0, // Autoincremented, so can be 0 for dummy purposes
    userId:    "cm2f3a8ra0000sl8zdb10q3d1 ",    // Foreign key to User
    bookId:    0,        // Foreign key to Book
    status:    "",
    createdAt: new Date(),
    message:   "empty",
    bookTitle: "updated book"
};

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
export function validateRequestData(requestData: Partial<BookRequest>): boolean {
        // Don't validate ID since sometimes you'll need to have
        const requiredFields = ["userId", "bookId"] as const;
      
        for (const field of requiredFields) {
          if (requestData[field] == null) {
            return false;
          }
        }
      
        return true; // No errors
      }
      