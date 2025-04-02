import { Book, BookRequest, RequestStatus, User } from "@prisma/client";
import axios from "axios";
import {
  RequestWithBookAndUser,
  validateBookData,
  validateRequestData,
  validateUserData,
} from "../util/types";
import { updateBook } from "./books";

/**
 * Utility function for fetching all requests
 *
 * @param none
 * @returns array of request (of type Requests)
 *
 * @remarks
 * - TODO: add filtering if needed
 */

export const getOneRequest = async (
  requestId: number
): Promise<BookRequest | undefined> => {
  try {
    const response = await axios.get(`/api/requests?id=${requestId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch requests", error);
  }
};

/**
 * Utility function for fetching all requests
 *
 * @param none
 * @returns array of request (of type Requests)
 *
 * @remarks
 * - TODO: add filtering if needed
 */
export const getRequests = async (): Promise<
  RequestWithBookAndUser[] | undefined
> => {
  try {
    const response = await axios.get("/api/requests");
    
    return response.data; //JSOn
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    } else {
      throw new Error("Failed to fetch requests: An unknown error occurred");
    }
  }
};

/**
 * Utility function for fetching all requests
 *
 * @param none
 * @returns array of request (of type Requests)
 *
 * @remarks
 * - TODO: add filtering if needed
 */
export const getRequestCount = async (): Promise<number> => {
  try {
    const response = await axios.get("/api/requests/count");

    return response.data; //JSOn
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    } else {
      throw new Error("Failed to fetch requests: An unknown error occurred");
    }
  }
};

/**
 * Utility function for fetching user's requests
 *
 * @param user
 * @returns array of user's requests (of type Requests)
 *
 * @remarks
 */
export const getUserRequests = async (
  userId: string
): Promise<(BookRequest & { user: User; book: Book })[] | undefined> => {
  try {
    const response = await axios.get(`/api/requests?userId=${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user's requests: ${error.message}`);
    } else {
      throw new Error(
        "Failed to fetch user's requests: An unknown error occurred"
      );
    }
  }
};

/**
 * Utility function for creating a request. Use if you want to include custom messages or have more functionality
 *
 * @param request the request to create
 * @returns the newly created request
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const createRequest = async (
  request: Omit<BookRequest, "id">
): Promise<BookRequest | undefined> => {
  try {
    if (!validateRequestData(request)) {
      throw new Error("Missing request fields");
    }
    const response = await axios.post("/api/requests", request);

    return response.data;
  } catch (error) {
    console.error("Failed to create request: ", error);
  }
};

/**
 * quick util function for creating a request with just the book and user.
 *
 * @param request the request to create
 * @returns the newly created request
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const createQuickRequest = async (
  book: Book,
  user: User,
  newStatus: RequestStatus
): Promise<BookRequest | undefined> => {
  try {
    if (!validateBookData(book) || !validateUserData(user)) {
      throw new Error("Missing request fields");
    }

    const request: Omit<BookRequest, "id"> = {
      // id: 0, // or handle it as undefined
      userId: user.id,
      bookId: book.id,
      createdAt: new Date(),
      status: newStatus,
      message: "",
      bookTitle: book.title,
      requestedOn: new Date(),
      returnedBy: new Date(),
    };

    const response = await axios.post("/api/requests", request);
    await updateBook({ ...book });

    return response.data;
  } catch (error) {
    console.error("Failed to create request: ", error);
    return undefined;
  }
};

/**
 * Utility function for updating a requests
 *
 * @param request with an id field
 * @returns the updated request
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const updateRequest = async (
  request: BookRequest
): Promise<BookRequest | undefined> => {
  try {
    if (!validateRequestData(request)) {
      throw new Error("Missing request fields");
    }
    const response = await axios.put("/api/requests", request);

    return response.data;
  } catch (error) {
    console.error("Failed to create request: ", error);
  }
};

/**
 * Utility function for deleting a request
 *
 * @param id the id number of the request to delete
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const deleteRequest = async (
  id: number
): Promise<BookRequest[] | undefined> => {
  try {
    const response = await axios.delete(`/api/requests?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete request: ", error);
  }
};

export const checkSendGridLimits = async () => {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/user/credits", {
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch SendGrid limits");
    }

    const data = await response.json();
    console.log("SendGrid Email Credits:", data);
    return data.remain || 0; // Remaining emails allowed
  } catch (error) {
    console.error("Error checking SendGrid limits:", error);
    return 0; // Assume limit is reached if check fails
  }
};
