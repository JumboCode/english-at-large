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
export async function getRequests() {
  try {
    const response = await axios.get("/api/requests");
    return response.data; //JSOn
  } catch (error) {
    throw new Error("Failed to fetch requests");
  }
}

/**
 * Utility function for creating a requests
 *
 * @param request WITHOUT an id field - this will be generated when posting
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function createRequest(request: Omit<BookRequest, "id">) {
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
