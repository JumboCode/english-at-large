import { prisma } from "@/lib/prisma";
import { BookRequest } from "@prisma/client";
import { validateRequestData, emptyRequest } from "@/lib/util/types";
import sgMail from "@sendgrid/mail";
import { UserRole } from "@prisma/client";

/**
 * Utility controller that gets all the Request in the backend.
 *
 * @returns All of the requests in the requests Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getAllRequestsController = async (): Promise<BookRequest[]> => {
  try {
    const requests = await prisma.bookRequest.findMany();
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    throw error;
  }
};

/**
 * Utility controller that gets one Request in the backend.
 *
 * @returns One of the requests in the requests Database
 * @params a number, the request's id
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getOneRequestController = async (
  id: number
): Promise<BookRequest> => {
  try {
    const request = await prisma.bookRequest.findUnique({
      where: { id: id },
    });

    if (!request) {
      throw new Error("Request not found!");
    } else {
      return request;
    }
  } catch (error) {
    console.error("Error fetching request: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates requests fields, then creates a BookRequest in backend.
 *
 * @returns requestData (with id) if request is valid, error otherwise
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postRequestController = async (
  requestData: Omit<BookRequest, "id">
): Promise<BookRequest> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  try {
    if (!validateRequestData(requestData)) {
      throw new Error("Missing required request properties");
    }
    // THIS IS CAUSING AN ERROR, MUST BE FIXED <-------------------------------------------------------------------- 
    // const request = await prisma.bookRequest.create({
    //   data: requestData,
    // });

    const users = await prisma.user.findMany();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

    if (users) {
      const admins = users.filter((user) => {
        return user.role === UserRole.Admin;
      });

      for (let i = 0; i < admins.length; i++) {
        const email = admins[i].email;
        if (email) {
          const borrower = await prisma.user.findUnique({
            where: { id: requestData.userId }});
          const msg = {
            to: email, 
            from: "englishatlarge427@gmail.com",
            subject: `${borrower?.name ?? "[No Username]"} Borrowed a Book`,
            text: `Borrower Name: ${borrower?.name ?? "[No Username]"} \n
            Borrower ID: ${requestData.userId} \n
            Book Borrowed: ${requestData.bookTitle} \n 
            Book ID: ${requestData.bookId} \n
            Borrowed on: ${requestData.requestedOn}`,
            html: `<p>
            <strong>Borrower Name:</strong> ${borrower?.name ?? "[No Username]"} <br>
            <strong> Borrower ID:</strong> ${requestData.userId} <br>
            <strong>Book Borrowed:</strong> ${requestData.bookTitle} <br> 
            <strong>Book ID: </strong>${requestData.bookId} <br>
            <strong>Borrowed on:</strong> ${requestData.requestedOn}
            </p>`,
          };

          sgMail
            .send(msg)
            .then((response) => {
              console.log(response[0].statusCode);
              console.log(response[0].headers);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    }

    // temporary, this should return the actual request when it isn't erroring
    return emptyRequest;
    // return request;
  } catch (error) {
    console.error("Error in postRequestController:", error);
    throw error;
  }
};

/**
 * Utility controller that updates the request.
 *
 * @params requestData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 * @returns requestData if request is valid, error otherwise
 */
export const putRequestController = async (
  requestData: BookRequest
): Promise<BookRequest> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  // handle id validation as well since validateBookData doesn't validate ID
  try {
    if (!validateRequestData(requestData)) {
      throw new Error("Missing required request properties");
    }

    const updatedRequest = await prisma.bookRequest.update({
      where: { id: requestData.id },
      data: requestData,
    });
    return updatedRequest;
  } catch (error) {
    console.error("Error updating requests", error);
    throw error;
  }
};

/**
 * Utility controller that deletes a request.
 *
 * @params the id for the request to delete
 * @remarks
 * @returns the deleted request
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const deleteRequestController = async (
  id: number
): Promise<BookRequest> => {
  try {
    const deletedBook = await prisma.bookRequest.delete({
      where: { id: id },
    });
    if (!deletedBook) {
      throw new Error("Book not found!");
    } else {
      return deletedBook;
    }
  } catch (error) {
    console.error("Error deleting request", error);
    throw error;
  }
};
