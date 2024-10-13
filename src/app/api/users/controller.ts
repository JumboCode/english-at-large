import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateUserData } from "../../../lib/util/types";
import { NextResponse } from "next/server";



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

  return updatedUser
};


