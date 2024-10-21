import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateUserData } from "../../../lib/util/types";
import { NextResponse } from "next/server";

export const getAllUsersController = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const getOneUserController = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error fetchin user: ", error);
    throw error;
  }
};

export const postUserController = async (userData: Omit<User, "id">) => {
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

export const putUserController = async (userData: User) => {
  try {
    if (!userData.id || !validateUserData(userData)) {
      return NextResponse.json(
        { error: "Missing id, and name or owner" },
        { status: 400 }
      );
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

export const deleteUserController = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      return await prisma.user.delete({
        where: { id: id },
      });
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};
