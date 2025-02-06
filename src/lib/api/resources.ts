import { OnlineResource } from "@prisma/client";
import axios from "axios";

/**
 * Utility function for fetching all Online Resources
 *
 * @param none
 * @returns array of Online Resources (of type OnlineResource)
 *
 * @remarks
 */
export const getAllResources = async (): Promise<
  OnlineResource[] | undefined
> => {
  try {
    const response = await axios.get("/api/resources");
    return response.data; //JSOn
  } catch (error) {
    throw new Error("Failed to fetch resources");
  }
};

/**
 * Utility function for fetching one resource
 *
 * @param resourceId
 * @returns one book (of type OnlineResource)
 *
 * @remarks
 */
export const getOneResource = async (
  resourceId: string
): Promise<OnlineResource | undefined> => {
  try {
    const response = await axios.get(`/api/resources/?id=${resourceId}`); // Using template literals for cleaner URL construction
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch resources");
  }
};

/**
 * Utility function for creating a resource
 *
 * @param resource WITHOUT an id field - this will be generated when posting
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const createResource = async (
  resource: Omit<OnlineResource, "id">
): Promise<OnlineResource | undefined> => {
  try {
    const response = await axios.post("/api/resources", resource);
    return response.data;
  } catch (error) {
    console.error("Failed to create resource: ", error);
  }
};

/**
 * Utility function for updating a resource
 *
 * @param resource
 * @returns the updated resource
 *
 * @remarks
 */
export const updateResource = async (
  resource: OnlineResource
): Promise<OnlineResource | undefined> => {
  try {
    const response = await axios.put("/api/resources", resource);
    return response.data;
  } catch (error) {
    console.error("Failed to create resource: ", error);
  }
};

/**
 * Utility function for deleting a resource
 *
 * @param resourceId
 * @returns nothing
 *
 * @remarks
 */
export const deleteResource = async (
  resourceId: string
): Promise<OnlineResource | undefined> => {
  try {
    const response = await axios.delete("/api/resources?id=" + resourceId);
    return response.data;
  } catch (error) {
    console.error("Failed to delete resource: ", error);
  }
};
