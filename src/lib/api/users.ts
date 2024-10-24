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
export const getAllUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await axios.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Failed to get user: ", error);
  }
};

/**
 * Utility function for fetching one user by ID
 *
 * @param id: string
 * @returns one User
 *
 * @remarks
 */
export const getOneUser = async (id: string): Promise<User | undefined> => {
  try {
    const response = await axios.get("api/users/?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Failed to get user: ", error);
  }
};

/**
 * Utility function for creating a user
 *
 * @param user WITHOUT an id field - this will be generated when posting
 * @returns the created user
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const createUser = async (
  user: Omit<User, "id" | "createdAt" | "updatedAt">
): Promise<User | undefined> => {
  try {
    if (!validateUserData(user)) {
      throw new Error("Missing user fields");
    }
    const response = await axios.post("/api/users", user);
    return response.data;
  } catch (error) {
    console.error("Failed to created user: ", error);
  }
};

export const inviteUser = async (name: string, email: string, role: string) => {
  try {
    if (is_empty(name)||is_empty(email)||is_empty(role)) {
      throw new Error("Missing user fields");
    }
    const response = await axios.post("/api/invite", {name: name, email: email, role: role});
    return response.data;
  } catch (error) {
    console.error("Failed to invite user: ", error);
  }

}

function is_empty(str: string) {
  return str === "";
}



/**
 * Utility function for updating a user
 *
 * @param user: User
 * @returns the updated user
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export const updateUser = async (user: User): Promise<User | undefined> => {
  try {
    if (!validateUserData(user)) {
      throw new Error("Missing user fields");
    }
    const response = await axios.put("/api/users", user);
    return response.data;
  } catch (error) {
    console.error("Failed to update user: ", error);
  }
};

/**
 * Utility function for deleting a user by ID
 *
 * @param user: id
 * @returns the deleted user.
 *
 * @remarks
 * - error handling (incorrect types, etc) is on both client and server side
 */
export async function deleteUser(id: string): Promise<User | undefined> {
  try {
    const response = await axios.delete("api/users/?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user: " + id, error);
  }
}
