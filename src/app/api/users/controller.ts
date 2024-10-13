import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateUserData } from "../../../lib/util/types";
import { NextResponse } from "next/server";

export const getAllUsersController = async () => {
  const users = await prisma.user.findMany();
  return users;
}

export const getOneUserController = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new Error("User not found");
  } else {
    return user;
  }
}

export const postUserController = async (userData: Omit<User, "id">) => {
  // Validate required fields
  if (!validateUserData(userData)) {
    return NextResponse.json(
      { error: "Missing required user properties" },
      { status: 400 }
    );
  }

  const newUser = await prisma.user.create({
    data: userData,
  });

  return newUser;
};

export const putUserController = async (userData: User) => {
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
};

export const deleteUserController = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new Error("User not found")
  } else {
    await prisma.user.delete({
      where: { id: id },
    });
  }
}
