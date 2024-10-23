import { Request as BookRequest } from "@prisma/client";
import axios from "axios";
import { validateRequestData } from "../util/types";

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
export const getRequests = async (): Promise<BookRequest[] | undefined> => {
  try {
    const response = await axios.get("/api/requests");
    console.log("response", response.data);

    return response.data; //JSOn
  } catch (error) {
    throw new Error("Failed to fetch requests");
  }
}

/**
 * Utility function for creating a requests
 *
 * @param request the request to create
 * @returns the newly created request
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const createRequest = async (request: Omit<BookRequest, "id">): Promise<BookRequest[] | undefined> => {
  try {
    if (!validateRequestData(request)) {
      throw new Error("Missing request fields");
    }
    const response = await axios.post("/api/requests", request);

    return response.data;
  } catch (error) {
    console.error("Failed to create request: ", error);
  }
}

/**
 * Utility function for updating a requests
 *
 * @param request with an id field
 * @returns the updated request
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const updateRequest = async (request: any): Promise<BookRequest[] | undefined> => {
  try {
    if (!validateRequestData(request)) {
      throw new Error("Missing request fields");
    }
    const response = await axios.put("/api/requests", request);

    return response.data;
  } catch (error) {
    console.error("Failed to create request: ", error);
  }
}

/**
 * Utility function for deleting a request
 *
 * @param id the id number of the request to delete
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const deleteRequest= async (id: number): Promise<BookRequest[] | undefined> => {
  try {
    const response = await axios.delete("api/requests/?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Failed to create request: ", error);
  }
}
