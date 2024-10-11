import { User } from "@prisma/client";
import axios from "axios";
import { validateUserData } from "../util/types";

/**
 * Utility function for fetching all books
 *
 * @param none
 * @returns array of books (of type Books)
 *
 * @remarks
 * - TODO: add filtering if needed
 */
// export async function getUsers() {
//   try {
//     const response = await axios.get("/api/users");
//     return response.data; //JSON
//   } catch (error) {
//     throw new Error("Failed to fetch books");
//   }
// }

/**
 * Utility function for creating a books
 *
 * @param book WITHOUT an id field - this will be generated when posting
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function createUser(user: Omit<User, "id">) {
  try {
    if (!validateUserData(user)) {
      throw new Error("Missing user fields");
    }
    const response = await axios.post("/api/users", user);
    return response.data;
  } catch (error) {
    console.error("Failed to create user: ", error);
  }
}

// Add other CRUD functions as needed (updateBook, deleteBook, etc.)
