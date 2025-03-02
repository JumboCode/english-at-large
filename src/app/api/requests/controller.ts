import { prisma } from "@/lib/prisma";
import { Book, BookRequest, User } from "@prisma/client";
import { validateRequestData } from "@/lib/util/types";
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
export const getAllRequestsController = async (): Promise<
  (BookRequest & { user: User; book: Book })[]
> => {
  try {
    const requests = await prisma.bookRequest.findMany({
      include: {
        user: true, // Fetch the related User
        book: true, // Fetch the related Book
      },
    });
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
      include: {
        user: true, // Fetch the related User
        book: true, // Fetch the related Book
      },
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
 * Utility controller that gets a user's Request in the backend.
 *
 * @returns One of the requests in the requests Database
 * @params a number, the user's clerk id
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getUserRequestController = async (
  userId: string
): Promise<(BookRequest & { book: Book })[]> => {
  try {
    const requests = await prisma.bookRequest.findMany({
      where: { userId: userId },
      include: {
        book: true, // Fetch the related Book
      },
    });

    return requests;
  } catch (error) {
    console.error("Error fetching request: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates requests fields, then creates a BookRequest in backend. Also emails all administators.
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

    const request = await prisma.bookRequest.create({
      data: requestData,
    });

    // email logic
    const users = await prisma.user.findMany();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

    if (users) {
      const admins = users
        .filter((user) => {
          return user.role === UserRole.Admin;
        })
        .map(async (user) => {
          const email = user.email;
          if (email) {
            const borrower = await prisma.user.findUnique({
              where: { id: requestData.userId },
            });
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
              <strong>Borrower Name:</strong> ${
                borrower?.name ?? "[No Username]"
              } <br>
              <strong> Borrower ID:</strong> ${requestData.userId} <br>
              <strong>Book Borrowed:</strong> ${requestData.bookTitle} <br>
              <strong>Book ID: </strong>${requestData.bookId} <br>
              <strong>Borrowed on:</strong> ${requestData.requestedOn}
              </p>`,
            };

            // UNCOMMENT THIS WHEN DONE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // await sgMail.send(msg).catch((error: unknown) => {
            //   console.error(error);
            // });
          }
        });

      await Promise.all(admins);
    }

    return request;
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
  requestData: BookRequest & { user: User; book: Book }
): Promise<BookRequest> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  // handle id validation as well since validateBookData doesn't validate ID
  try {
    if (!validateRequestData(requestData)) {
      throw new Error("Missing required request properties");
    }

    // ugly but necessary for destructing...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, book, ...newRequest } = requestData;

    const updatedRequest = await prisma.bookRequest.update({
      // where: { id: requestData.id },
      // data: requestData,
      where: { id: newRequest.id },
      data: newRequest,
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
