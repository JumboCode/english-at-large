import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateUserData } from "../../../lib/util/types";
// import clerkClient from "@/clerk";

export const getAllUsersController = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const getOneUserController = async (id: string): Promise<User> => {
  try {
    console.log("in controller: ", id)

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw error;
  }
};

export const postUserController = async (
  userData: Omit<User, "id">
): Promise<User> => {
  try {
    // Validate required fields
    if (!validateUserData(userData)) {
      throw new Error("Missing required user properties");
    }

    // Create the new user in the datry tabase
    const newUser = await prisma.user.create({
      data: userData,
    });

    return newUser;
  } catch (error) {
    console.error("Error in postUserController:", error);
    throw error; // Let the calling function handle the error and response
  }
};

export const putUserController = async (userData: User): Promise<User> => {
  try {
    if (!userData.id || !validateUserData(userData)) {
      throw new Error("Missing id, and name or owner");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: userData,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

export const deleteUserController = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      // await clerkClient.users.deleteUser(user.clerkId)

      return await prisma.user.delete({
        where: { id: id },
      });
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};
