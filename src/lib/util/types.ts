import {
  Book,
  BookLevel,
  // BookSkills,
  BookType,
  Prisma,
  RequestStatus,
  User,
} from "@prisma/client";
import { BookRequest } from "@prisma/client";

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                                 BOOKS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////
export const DEFAULT_PAGINATION_START_PAGE = 1;
export const DEFAULT_PAGINATION_LIMIT = 10;
export const MAX_REQUESTS = 5;

export type BookWithRequests = Prisma.BookGetPayload<{
  include: { requests: true };
}>;

export interface BookStats {
  totalRequests: number;
  uniqueUsers: number;
}
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

//OLD (here you are saying that a book that has request.status = RequestStatus.Requested is unavailable - which in my opinion is wrong)
// export function getAvailableCopies(book: BookWithRequests): number {
//   const bookAndRequests = book as BookWithRequests;

//   const filteredRequests = bookAndRequests.requests.filter((r) => {
//     return (
//       r.status !== RequestStatus.Returned && r.status != RequestStatus.Hold
//     ); // TODO: track the lost case
//   });

//   return bookAndRequests.copies - filteredRequests.length;
// }

//new
export function getAvailableCopies(book: BookWithRequests): number {
  if (!book || !book.requests) return 0;

  // Count only books that are unavailable
  const unavailableBooks = book.requests.filter((request) => {
    return (
      // Only these statuses mean the book is  unavailable
      request.status === RequestStatus.Borrowed ||
      request.status === RequestStatus.Lost ||
      request.status === RequestStatus.Pickup ||
      request.status === RequestStatus.Requested
    );
  }).length;

  const availableCopies = book.copies - unavailableBooks;

  // Log data inconsistencies for admin attention
  if (availableCopies < 0) {
    console.warn(
      `[DATA INCONSISTENCY] Book "${book.title}" (ID: ${book.id}) has ${unavailableBooks} ` +
        `unavailable copies but only ${book.copies} total copies in inventory.`
    );
  }

  return availableCopies;
}

/**
 * "Empty book" with dummy data.
 */
export const emptyBook: Book = {
  id: 0, // Autoincremented, so can be 0 for dummy purposes
  title: "Untitled Book",
  author: "",
  isbn: ["000-0-00-000000-0"],
  publisher: "",
  level: BookLevel.Beginner,
  bookType: BookType.Reference,
  scanLink: "http://example.com/scan",
  description: "",
  notes: "",
  skills: [],
  releaseDate: null,
  numPages: 0,
  coverURL: "",
  copies: 1,
  createdAt: new Date(),
  extraInfo: null,
};

/**
 * "Empty book" with dummy data.
 */
export const newEmptyBook: Omit<Book, "id"> = {
  title: "",
  author: "",
  isbn: [],
  publisher: "",
  level: BookLevel.Beginner,
  bookType: BookType.Reference,
  scanLink: "",
  description: "",
  notes: "",
  skills: [],
  releaseDate: null,
  numPages: 0,
  coverURL: "",
  copies: 1,
  createdAt: new Date(),
  extraInfo: null,
};

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                              REQUESTS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

export type RequestWithBookAndUser = Prisma.BookRequestGetPayload<{
  include: { book: { include: { requests: true } }; user: true };
}>;

/**
 * "Empty book" with dummy data.
 */
export const emptyRequest: BookRequest = {
  id: 0, // Autoincremented, so can be 0 for dummy purposes
  userId: "cm2f3a8ra0000sl8zdb10q3d1 ", // Foreign key to User
  bookId: 0, // Foreign key to Book
  status: RequestStatus.Requested,
  createdAt: new Date(),
  message: "empty",
  bookTitle: "updated book",
  requestedOn: new Date(),
  returnedBy: new Date(),
  dueDate: null,
};

export const newEmptyRequest: Omit<BookRequest, "id"> = {
  userId: "cm2f3a8ra0000sl8zdb10q3d1", // Foreign key to User
  bookId: 1, // Foreign key to Book
  status: RequestStatus.Requested,
  createdAt: new Date(),
  message: "empty",
  bookTitle: "updated book",
  requestedOn: new Date(),
  returnedBy: new Date(),
  dueDate: null,
};

/**
 * Utility function for checking if a request is valid (no fields are empty, etc.)
 *
 * @param requestData - Partial request data to be validated.
 *
 * */

export function validateRequestData(
  requestData: Partial<BookRequest>
): boolean {
  // Don't validate ID since sometimes you'll need to have
  const requiredFields = ["userId", "bookId"] as const;

  for (const field of requiredFields) {
    if (requestData[field] === null || requestData[field] === "") {
      return false;
    }
  }
  return true; // No errors
}

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                                 USERS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////
export type UserWithRequests = Prisma.UserGetPayload<{
  include: { requests: true };
}>;

export const emptyUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
  name: "Bob",
  email: "bob@gmail.com",
  role: "Tutor",
  clerkId: "placeholder",
  pending: false,
  inviteID: "",
};

export const newEmptyUser: Omit<User, "id" | "createdAt" | "updatedAt"> = {
  name: "U12",
  email: "u1@gmail.com",
  role: "Admin",
  clerkId: "placeholder",
  pending: false,
  inviteID: "",
};

/**
 * Utility function for checking if a user is valid (no fields are empty, etc.)
 *
 * @param userData - Partial user data to be validated.
 * @returns `true` if valid, otherwise false
 *
 * @remarks
 * - This function does **not** validate the `id` field. This is to account for
 *   cases where the ID has not been assigned yet (e.g., when creating a new user).
 */

export function validateUserData(userData: Partial<User>): boolean {
  // Don't validate ID since sometimes you'll need to have
  // TODO: add bookGroup back in
  const requiredFields = ["name", "email", "role", "clerkId"] as const;

  for (const field of requiredFields) {
    if (!userData[field]) {
      return false;
    }
  }

  return true;
}

/**
 * This type allows us to define and use change events similar to HTML ChangeEvents
 * @notes you'll need to define the type (T) that it's storing. 
 * use to handle useStates of complex types like Book:
 * @example  
 * const bookChangeHandler = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | CustomChangeEvent<BookSkills[]>
  ) => {
    const { name, value } = e.target;
    const book = { ...newBook, [name]: value };
    setNewBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };
 *
 */
export interface CustomChangeEvent<T> {
  target: {
    name: string;
    value: T; // Use T for the value
  };
  preventDefault?: () => void;
}

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                              RESOURCE                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

export type DriveFolderType = {
  name: string;
  id: string;
  mimeType: string;
  kind: string;
};

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                                 OTHER                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

export interface ErrorStateAndMessage {
  error: boolean;
  message: string;
}

export const STATUS_OK: ErrorStateAndMessage = {
  error: false,
  message: "",
};
