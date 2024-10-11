import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { validateUserData } from "../../../lib/util/types";
import { NextResponse } from "next/server";


export const postUserController = async (userData: Omit<User, "id">) => {
    // Validate required fields. Note that empty strings are also false values (so they can't be blank)
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