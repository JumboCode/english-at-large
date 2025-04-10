import { User } from "@prisma/client";
import axios from "axios";
import { UserWithRequests, validateUserData } from "../util/types";
import { UserResource } from "@clerk/types";
import { Invitation } from "@clerk/backend";

/**
 * Utility function for fetching all users
 *
 * @param none
 * @returns array of users (of type Users)
 *
 * @remarks
 * - TODO: add filtering if needed
 */

// OLD:
// export const getAllUsers = async (): Promise<User[] | undefined> => {
//   try {
//     const response = await axios.get("/api/users");
//     return response.data;
//   } catch (error) {
//     console.error("Failed to get user: ", error);
//   }
// };

export const getAllUsers = async (
  page: number = 0,
  limit: number = 0,
  fromDate?: Date,
  endDate?: Date
): Promise<
  { users: UserWithRequests[]; total: number; totalPages: number } | undefined
> => {
  try {
    const response = await axios.get(`/api/users?page=${page}&limit=${limit}`, {
      params: {
        fromDate: fromDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get users: ", error);
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
    const response = await axios.get("/api/users/?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Failed to get user: ", error);
  }
};

/**
 * Utility function for fetching one user by Clerk ID
 *
 * @param id: string
 * @returns one User
 *
 * @remarks
 */
export async function getOneUserByClerkid(
  clerkId: string
): Promise<User | null> {
  try {
    const response = await axios.get<User>(`/api/users?clerkId=${clerkId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw error;
  }
}

/**
 *
 * @param clerkId - a user's ID in clerk, NOT their neon.tech id.
 *
 * @returns - the user's associated clerk profile. this should only be used internally
 */
export const getClerkUser = async (
  clerkId: string
): Promise<UserResource | undefined> => {
  try {
    const response = await axios.get("api/invite/?id=" + clerkId);
    return response.data;
  } catch (error) {
    console.error("Failed to get clerk user: ", error);
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

/**
 *
 * @param name - the user's name
 * @param email - the user's email
 * @param role
 * @param id - the user's neon.tech id
 * @returns clerk invitation
 *
 * @notes begins the user invitation process. the flow goes:
 * - admin invite the user
 * - 'pending' user is created in neon tech
 * - invitation is sent Clerk (and created in Clerk)
 * - user accepts invite. clerk invitation (should) go away, and clerk user is created
 * - 'pending' is set to false
 */
export const inviteUser = async (
  name: string,
  email: string,
  role: string,
  id: string
): Promise<Invitation | undefined> => {
  try {
    if (!name || !email || !role || !id) {
      throw new Error("Missing user fields");
    }

    const response = await axios.post("/api/invite", {
      name: name,
      email: email,
      role: role,
      id: id,
    });

    const invite: Invitation = response.data;

    return invite;
  } catch (error) {
    console.error("Failed to invite user: ", error);
    throw error;
  }
};

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
    const response = await axios.delete("/api/users?id=" + id);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user: " + id, error);
  }
}
