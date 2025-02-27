import {
  Book,
  BookLevel,
  // BookSkills,
  BookType,
  OnlineResource,
  RequestStatus,
  ResourceFormat,
  ResourceTopic,
  User,
} from "@prisma/client";
import { BookRequest } from "@prisma/client";

////////////////////////////////////////////////////////////////////////////////
/////                                                                      /////
/////                                 BOOKS                                /////
/////                                                                      /////
////////////////////////////////////////////////////////////////////////////////

export const MAX_REQUESTS = 10;

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
  isbn: ["000-0-00-000000-0"],
  publisher: "",
  level: BookLevel.Beginner,
  bookType: BookType.Reference,
  scanLink: "http://example.com/scan",
  description: "",
  notes: "",
  // status: BookStatus.Available,
  skills: [],
  releaseDate: null,
  numPages: 0,
  coverURL: "",
  availableCopies: 0,
  copies: 0,
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
  // status: BookStatus.Available,
  skills: [],
  releaseDate: null,
  numPages: 0,
  coverURL: "",
  availableCopies: 0,
  copies: 0,
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
  userId: "cm2f3a8ra0000sl8zdb10q3d1 ", // Foreign key to User
  bookId: 0, // Foreign key to Book
  status: RequestStatus.Requested,
  createdAt: new Date(),
  message: "empty",
  bookTitle: "updated book",
  requestedOn: new Date(),
  returnedBy: new Date(),
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

export const newEmptyResource: Omit<OnlineResource, "id"> = {
  createdAt: new Date(),
  name: "",
  link: "Hello",
  level: BookLevel.Beginner,
  topic: ResourceTopic.Culture,
  skills: [],
  format: ResourceFormat.Video,
};

export function validateResourceData(
  resourceData: Partial<OnlineResource>
): boolean {
  // Don't validate ID since sometimes you'll need to have
  const requiredFields = [
    "createdAt",
    "name",
    "link",
    "level",
    "topic",
    "skills",
    "format",
  ] as const;

  for (const field of requiredFields) {
    if (!resourceData[field]) {
      return false;
    }
  }

  return true; // No errors
}

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
