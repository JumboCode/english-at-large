import axios from "axios";
import { DriveFolderType } from "../util/types";

export const getFolderResources = async (folderId: string): Promise<number> => {
  try {
    const response = await axios.get(`/api/drive/?id=${folderId}`); // Using template literals for cleaner URL construction
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch folder resources: ${error.message}`);
    } else {
      throw new Error("Failed to fetch folder: An unknown error occurred");
    }
  }
};

export const getAllSubFolders = async (
  folderId: string
): Promise<DriveFolderType[]> => {
  try {
    const response = await axios.get(`/api/drive/?id=${folderId}`); // Using template literals for cleaner URL construction
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch folder resources: ${error.message}`);
    } else {
      throw new Error("Failed to fetch folder: An unknown error occurred");
    }
  }
};
