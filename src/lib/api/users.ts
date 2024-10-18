import { User } from "@prisma/client";
import axios from "axios";
import { validateUserData } from "../util/types";

/**
 * Utility function for fetching all users
 *
 * @param none
 * @returns array of users (of type Users)
 *
 * @remarks
 * - TODO: add filtering if needed
 */
export async function getAllUsers() {
  try {
    const response = await axios.get("/api/users");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
}

/**
 * Utility function for fetching one user by ID
 *
 * @param id: string
 * @returns one User
 *
 * @remarks
 */
export async function getOneUser(id: string) {
  try {
    const response = await axios.get("api/users/?id=" + id);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user with id: " + id);
  }
}

/**
 * Utility function for creating a user
 *
 * @param user WITHOUT an id field - this will be generated when posting
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function createUser(
  user: Omit<User, "id" | "createdAt" | "updatedAt">
) {
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

/**
 * Utility function for updating a user
 *
 * @param user: User
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function updateUser(user: User) {
  try {
    if (!validateUserData(user)) {
      throw new Error("Missing user fields");
    }
    const response = await axios.put("/api/users", user);
    return response.data;
  } catch (error) {
    console.error("Failed to update user: ", error);
  }
}

/**
 * Utility function for deleting a user by ID
 *
 * @param user: id
 * @returns nothing
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function deleteUser(id: string) {
  try {
    const response = await axios.delete("api/users/?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user: " + id, error);
  }
}
