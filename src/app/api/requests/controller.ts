import { prisma } from "@/lib/prisma";
import { Book, BookRequest, User, RequestStatus, Prisma } from "@prisma/client";
import { RequestWithBookAndUser, validateRequestData } from "@/lib/util/types";
import sgMail from "@sendgrid/mail";
import { UserRole } from "@prisma/client";
import { MAX_REQUESTS } from "@/lib/util/types";
import { checkSendGridLimits } from "@/lib/api/requests";

/**
 * Utility controller that gets all the Request in the backend.
 *
 * @returns All of the requests in the requests Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const getAllRequestsController = async (
  fromDate?: Date,
  endDate?: Date
): Promise<RequestWithBookAndUser[]> => {
  try {
    const where: Prisma.BookRequestWhereInput = {};

    if (fromDate || endDate) {
      where.requestedOn = {};
      if (fromDate) where.requestedOn.gte = fromDate;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.requestedOn.lte = end;
      }
    }

    const requests = await prisma.bookRequest.findMany({
      where,
      include: {
        user: true, // Fetch the related User
        book: {
          include: {
            requests: true,
          },
        }, // Fetch the related Book
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
): Promise<RequestWithBookAndUser> => {
  try {
    const request = await prisma.bookRequest.findUnique({
      where: { id: id },
      include: {
        user: true, // Fetch the related User
        book: {
          include: {
            requests: true,
          },
        }, // Fetch the related Book
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

    const request = await prisma.$transaction(async (tx) => {
      // reject existing holds
      const existingHold = await prisma.bookRequest.findFirst({
        where: {
          userId: requestData.userId,
          bookId: requestData.bookId,
          status: {
            in: [
              RequestStatus.Hold,
              RequestStatus.Pickup,
              RequestStatus.Borrowed,
            ],
          },
        },
      });

      if (existingHold) {
        throw new Error("User already has an active request for this book.");
      }
      await tx.book.update({
        where: { id: requestData.bookId },
        data: { extraInfo: "" },
      });

      const book = await tx.book.findUnique({
        where: { id: requestData.bookId },
        include: {
          requests: {
            where: {
              status: {
                notIn: [RequestStatus.Returned, RequestStatus.Hold],
              },
            },
          },
        },
      });

      if (book != null) {
        const activeRequestCount = book.requests.length;

        //if a book has no available copies when it is being borrowed, send the User into holds.

        if (book.copies - activeRequestCount < 0) {
          console.warn(`Negative available copies for book ID ${book.id}`);
          requestData.status = RequestStatus.Hold;
          requestData.dueDate = null;
        }

        if (book.copies - activeRequestCount === 0) {
          requestData.status = RequestStatus.Hold;
          requestData.dueDate = null;
        }
        const newRequest = await tx.bookRequest.create({
          data: requestData,
        });
        return newRequest;
      }
    });

    if (!request)
      throw Error("Prisma transaction failed and request is undefined");

    // if it's a hold (or anything else, don't send an email to the admins)
    if (request && request.status !== RequestStatus.Requested) return request;

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

            await sgMail.send(msg).catch((error: unknown) => {
              console.error(error);
            });
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

    // Add validation to prevent future returnedBy dates
    if (
      requestData.returnedBy &&
      new Date(requestData.returnedBy) > new Date()
    ) {
      // If returnedBy is in the future, reset it to null
      requestData.returnedBy = null;
      console.warn(
        `Prevented future returnedBy date for request ID ${requestData.id}`
      );
    }

    // exclude the request in question from the #available copies
    const availableCopies = await getAvailableCopies(
      requestData.bookId,
      requestData.id
    );

    // console.log("available copies [excluding this one]: ", availableCopies);
    // Prevent requesting, borrowing, or marking as pickup if no copies are available
    if (
      (requestData.status === RequestStatus.Pickup ||
        requestData.status === RequestStatus.Requested) &&
      availableCopies <= 0
    ) {
      throw new Error("No available copies for pickup");
    }

    //

    // ugly but necessary for destructing...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, book, ...newRequest } = requestData;

    const updatedRequest = await prisma.bookRequest.update({
      where: { id: newRequest.id },
      data: newRequest,
    });

    // move next book off hold list
    if (requestData.status === RequestStatus.Returned) {
      promoteNextHold(requestData.bookId);
    }

    // note: this is assuming that only the status changes when updating, otherwise
    // if you edit another field of something on pickup it'll send another email
    // changing hold to pickup --> send email
    if (newRequest.status === RequestStatus.Pickup) {
      const emailsLeft = await checkSendGridLimits();
      if (emailsLeft <= 0) throw new Error("Maximum emails reached today.");
      // notify tutor
      if (!user.email) {
        throw new Error("Tutor email not found");
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

      const requests = await prisma.bookRequest.findMany({
        where: { userId: user.id },
      });
      const borrowed = requests.filter(
        (request) =>
          request.status !== RequestStatus.Returned &&
          request.status !== RequestStatus.Lost &&
          request.status !== RequestStatus.Hold
      );

      // check if user has exceeded limit
      const exceededLimit: boolean = borrowed && borrowed.length > MAX_REQUESTS;

      const tutorMsg = {
        to: user.email,
        from: "englishatlarge427@gmail.com",
        subject: `Book Request Moved to Pickup: ${book.title}`,
        text: `The following hold for: \n
            Book Title: ${book.title} \n
            Book ID: ${book.id} \n
            which was placed on ${
              requestData.requestedOn
            } has been moved from hold to pickup.
            Please ensure you arrive to retrieve it. \n\n
            ${
              exceededLimit
                ? "However, you are currently at the max number of borrowed books. \
              Please return a book before picking up this one. </strong>"
                : ""
            }`,

        html: `<p> The following hold for: <br>
            <strong> Book Title: </strong>  ${book.title} <br>
            <strong> Book ID: </strong> ${book.id}  <br>
            which was placed on <strong> ${
              requestData.requestedOn
            } </strong> has been moved
            from hold to pickup. Please ensure you arrive to retrieve it. <br> <br>
            ${
              exceededLimit
                ? "<strong> However, you are currently at the max number of borrowed books. \
              Please return a book before picking up this one. </strong>"
                : ""
            } </p>`,
      };

      await sgMail.send(tutorMsg).catch((error: unknown) => {
        console.error(error);
      });

      // Notify admins
      const admins = await prisma.user.findMany({
        where: { role: UserRole.Admin },
      });

      if (admins) {
        admins.map(async (user) => {
          const email = user.email;
          if (email) {
            const adminMsg = {
              to: email,
              from: "englishatlarge427@gmail.com",
              subject: `Request by ${
                user.name ?? "[No Username]"
              }: Hold to Pickup`,

              text: `Holder Name: ${user.name ?? "[No Username]"} \n
                  Holder Email: ${user.email} \n
                  Holder ID: ${requestData.userId} \n
                  Book Held: ${requestData.bookTitle} \n
                  Book ID: ${requestData.bookId} \n
                  Hold Placed On: ${requestData.requestedOn} \n\n
                  The status of this request has been changed from Hold to Pickup.\n
                  Please ensure proper handling of request.`,

              html: `<p>
                  <strong> Holder Name:</strong> ${
                    user.name ?? "[No Username]"
                  } <br>
                  <strong> Holder ID:</strong> ${requestData.userId} <br>
                  <strong>Book Held:</strong> ${requestData.bookTitle} <br>
                  <strong>Book ID: </strong>${requestData.bookId} <br>
                  <strong>Hold Placed On:</strong> ${
                    requestData.requestedOn
                  } <br><br>
                  The status of this request has been changed from <strong> Hold </strong>
                  to <strong> Pickup </strong>. <br>
                  Please ensure proper handling of request.

                  ${
                    exceededLimit
                      ? "<br> <br> <strong> This user has exceeded the maximum \
                         number of requests. Please ensure that they return a \
                         book before loaning this out. </strong>"
                      : ""
                  }
                  </p>`,
            };

            await sgMail.send(adminMsg).catch((error: unknown) => {
              console.error(error);
            });
          }
        });

        await Promise.all(admins);
      }
    }

    return updatedRequest;
  } catch (error) {
    console.error("Error updating requests", error);
    throw error;
  }
};

export const getAvailableCopies = async (
  bookId: number,
  excludeRequestId?: number
): Promise<number> => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      requests: {
        where: {
          status: {
            notIn: [
              RequestStatus.Returned,
              RequestStatus.Lost,
              RequestStatus.Hold,
            ],
          },
          ...(excludeRequestId ? { id: { not: excludeRequestId } } : {}),
        },
      },
    },
  });

  if (!book) throw new Error(`Book with ID ${bookId} not found`);

  const activeRequests = book.requests.length;
  return book.copies - activeRequests;
};

/*
 * helper function to pop next hold off the list
 */
const promoteNextHold = async (bookId: number): Promise<void> => {
  const availableCopies = await getAvailableCopies(bookId);

  if (availableCopies > 0) {
    const nextHold = await prisma.bookRequest.findFirst({
      where: {
        bookId,
        status: RequestStatus.Hold,
      },
      orderBy: { requestedOn: "asc" },
    });

    if (nextHold) {
      const newDueDate = new Date();
      newDueDate.setMonth(newDueDate.getMonth() + 6);

      await prisma.bookRequest.update({
        where: { id: nextHold.id },
        data: {
          status: RequestStatus.Requested,
          dueDate: newDueDate,
        },
      });
    }
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
    const deletedRequest = await prisma.bookRequest.delete({
      where: { id: id },
    });
    if (!deletedRequest) throw new Error("Book not found!");
    promoteNextHold(deletedRequest.bookId);

    return deletedRequest;
  } catch (error) {
    console.error("Error deleting request", error);
    throw error;
  }
};
