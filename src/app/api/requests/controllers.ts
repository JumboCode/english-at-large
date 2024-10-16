import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Request as BookRequest } from "@prisma/client";
import { validateRequestData } from "@/lib/util/types";
/**
 * Utility controller that gets all the Request in the backend.
 *
 * @returns All of the requests in the requests Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getController = async () => {
  
  const request = await prisma.request.findMany();

  return  NextResponse.json(request);
};


/**
 * Utility controller that validates requests fields, then creates a Request in backend.
 *
 * @returns requestData (with id) if request is valid, error otherwise
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postController = async (requestData: Omit<BookRequest, "id">) => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)

  if (!validateRequestData(requestData)) {
    return NextResponse.json(
      { error: "Missing required request properties" },
      { status: 400 }
    );
  }
  
  const newRequest = await prisma.request.create({
    data: requestData,
  });

  return  NextResponse.json(newRequest);
};


 
/**
 * Utility controller that updates the book.
 *
 * @returns requestData if request is valid, error otherwise
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
  export const putController = async (requestData: BookRequest) => {
    // Validate required fields. Note that empty strings are also false values (so they can't be blank)
    // handle id validation as well since validateBookData doesn't validate ID
    
    if (!validateRequestData(requestData)) {
      return NextResponse.json(
        { error: "Missing required request properties" },
        { status: 400 }
      );
    }
    
    const updatedRequest = await prisma.request.update({
      where: { id: requestData.id },
      data: requestData,
    });
    return NextResponse.json(updatedRequest);
  };

  /**
 * Utility controller that checks the book id and deletes if possible.
 *
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
  export const deleteController = async (requestData: BookRequest) => {

    if (!validateRequestData(requestData)) {
      return NextResponse.json(
        { error: "Missing required request properties" },
        { status: 400 }
      );
    }
    

    await prisma.request.delete({
    	where: { id: requestData.id },
    });
  };