import { DriveFolderType } from "@/lib/util/types";
import axios from "axios";

export const getCountController = async (folderId: string): Promise<number> => {
  try {
    if (folderId === undefined) {
      throw new Error("Missing folder id");
    }
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.DRIVE_API_KEY}`
    );

    if (response) {
      return response.data.files.length;
    } else throw new Error("folder not found!");
  } catch (error) {
    console.error("Error fetching book: ", error);
    throw error;
  }
};

export const getSubFoldersController = async (
  folderId: string
): Promise<DriveFolderType> => {
  try {
    if (folderId === undefined) {
      throw new Error("Missing folder id");
    }
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.DRIVE_API_KEY}`
    );

    if (response) {
      return response.data.files;
    } else throw new Error("folder not found!");
  } catch (error) {
    console.error("Error fetching book: ", error);
    throw error;
  }
};
