import { prisma } from "@/lib/prisma";
import { validateResourceData } from "@/lib/util/types";
import { OnlineResource } from "@prisma/client";
/**
 * Utility controller that validates book fields, then creates a Book in backend.
 *
 * @returns resourceData (with id) if book is valid, error otherwise
 * @params resourceData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postResourceController = async (
  resourceData: Omit<OnlineResource, "id">
): Promise<OnlineResource> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  try {
    if (!validateResourceData(resourceData)) {
      throw new Error("Missing required book properties");
    }

    const newResource = await prisma.onlineResource.create({
      data: resourceData,
    });

    return newResource;
  } catch (error) {
    console.error("Error Posting Resouce: ", error);
    throw error;
  }
};

export const getAllResourcesController = async (): Promise<OnlineResource[]> => {
  try {
    const resources = await prisma.onlineResource.findMany();
    return resources;
  } catch (error) {
    console.error("Error fetching resources: ", error);
    throw error;
  }
};

export const getOneResourceController = async (resourceId: string): Promise<OnlineResource> => {
  try {
    if (resourceId === undefined || resourceId === null) {
      throw new Error("Missing book id");
    }

    const findResource = await prisma.onlineResource.findUnique({
      where: { id: resourceId },
    });

    if (findResource) return findResource;
    else throw new Error("Resource not found!");
  } catch (error) {
    console.error("Error fetching resource: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns resourceData (with id) if book is valid, error otherwise
 * @params resourceData
 * @remarks
 *  - N/A
 */
export const putResourceController = async (resourceData: OnlineResource): Promise<OnlineResource> => {
  try {
    if (!resourceData.id || !validateResourceData(resourceData)) {
      throw new Error("Missing id, and name or owner");
    }

    const updatedResource = await prisma.onlineResource.update({
      where: { id: resourceData.id },
      data: resourceData,
    });

    if (updatedResource) return updatedResource;
    else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error Putting Book: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns resourceData (with id) if book is valid, error otherwise
 * @params resourceData
 * @remarks
 *  - N/A
 */
export const deleteResourceController = async (resourceId: string): Promise<OnlineResource> => {
  try {
    if (resourceId === null || resourceId === undefined) throw new Error("Invalid ID");

    const deletedResource = await prisma.onlineResource.delete({
      where: { id: resourceId },
    });

    if (deletedResource) return deletedResource;
    else throw new Error("Resource not found!");
  } catch (error) {
    console.error("Error deleting resource", error);
    throw error;
  }
};
