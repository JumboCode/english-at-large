import { prisma } from "@/lib/prisma";
import { Book } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Utility controller that gets all the Books in the backend.
 *
 * @returns All of the books in the Book Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getController = async () => {
  
  const request = await prisma.request.findMany();

  return request;
};


/**
 * Utility controller that validates book fields, then creates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postController = async (requestData: Omit<Request, "id">) => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)

  const newRequest = await prisma.request.create({
    data: requestData,
  });

  return newRequest;
};


 
/**
 * Utility controller that updates the book.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
  export const putController = async (requestData: Request) => {
    // Validate required fields. Note that empty strings are also false values (so they can't be blank)
    // handle id validation as well since validateBookData doesn't validate ID
    const updatedRequest = await prisma.request.update({
      where: { id: requestData.id },
      data: requestData,
    });
    return updatedRequest;
  };

  /**
 * Utility controller that checks the book id and deletes if possible.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
  export const deleteController = async (requestData: Request) => {
    if (!requestData.id) {
    	return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.request.delete({
    	where: { id: requestData.id },
    });
  };