import { prisma } from "@/lib/prisma";
import { BookRequest } from "@prisma/client";
import { validateRequestData } from "@/lib/util/types";

/**
 * Utility controller that gets all the Request in the backend.
 *
 * @returns All of the requests in the requests Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getAllRequestsController = async (): Promise<BookRequest[]> => {
  try {
    const requests = await prisma.bookRequest.findMany({
      include: {
        user: true, // Fetch the related User
        book: true, // Fetch the related Book
      },
    });
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    throw error;
  }
};

/**
 * Utility controller that gets one Request in the backend.
 *
 * @returns One of the requests in the requests Database
 * @params a number, the request's id
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getOneRequestController = async (
  id: number
): Promise<BookRequest> => {
  try {
    const request = await prisma.bookRequest.findUnique({
      where: { id: id },
      include: {
        user: true, // Fetch the related User
        book: true, // Fetch the related Book
      },
    });

    if (!request) {
      throw new Error("Request not found!");
    } else {
      return request;
    }
  } catch (error) {
    console.error("Error fetching request: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates requests fields, then creates a BookRequest in backend.
 *
 * @returns requestData (with id) if request is valid, error otherwise
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postRequestController = async (
  requestData: Omit<BookRequest, "id">
): Promise<BookRequest> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  try {
    if (!validateRequestData(requestData)) {
      throw new Error("Missing required request properties");
    }

    const newRequest = await prisma.bookRequest.create({
      data: requestData,
    });

    return newRequest;
  } catch (error) {
    console.error("Error in postRequestController:", error);
    throw error;
  }
};

/**
 * Utility controller that updates the request.
 *
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 * @returns requestData if request is valid, error otherwise
 */
export const putRequestController = async (
  requestData: BookRequest
): Promise<BookRequest> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  // handle id validation as well since validateBookData doesn't validate ID
  try {
    if (!validateRequestData(requestData)) {
      throw new Error("Missing required request properties");
    }

    const { book, user, ...newRequest } = requestData;

    const updatedRequest = await prisma.bookRequest.update({
      // where: { id: requestData.id },
      // data: requestData,
      where: { id: newRequest.id },
      data: newRequest,
    });
    return updatedRequest;
  } catch (error) {
    console.error("Error updating requests", error);
    throw error;
  }
};

/**
 * Utility controller that deletes a request.
 *
 * @params the id for the request to delete
 * @remarks
 * @returns the deleted request
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const deleteRequestController = async (
  id: number
): Promise<BookRequest> => {
  try {
    const deletedBook = await prisma.bookRequest.delete({
      where: { id: id },
    });
    if (!deletedBook) {
      throw new Error("Book not found!");
    } else {
      return deletedBook;
    }
  } catch (error) {
    console.error("Error deleting request", error);
    throw error;
  }
};
