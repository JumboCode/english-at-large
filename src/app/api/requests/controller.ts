import { prisma } from "@/lib/prisma";
import { Book, BookRequest, User, RequestStatus } from "@prisma/client";
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
  userId: string,
): Promise<
(BookRequest & { book: Book })[]> => {
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

    // ugly but necessary for destructing...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user, book, ...newRequest } = requestData;

    const updatedRequest = await prisma.bookRequest.update({
      where: { id: newRequest.id },
      data: newRequest,
    });

    // changing hold to pickup --> send email //TODO:
    if (newRequest.status === RequestStatus.Pickup) {
        // Get the tutor (user who made the request)
        if (!user.email) {
          throw new Error("Tutor email not found");
        }
    
        sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");
    
        const tutorMsg = {
          to: user.email,
          from: "englishatlarge427@gmail.com",
          subject: `Book Request Moved to Pickup: ${book.title}`,
          text: `The following hold for: \n
          Book Title: ${book.title} \n
          Book ID: ${book.id} \n
          which was placed on ${requestData.requestedOn} has been moved from hold to pickup. 
          Please ensure you arrive to retrieve it.`,

          html: `<p> The following hold for: <br>
          <strong> Book Title: </strong>  ${book.title} <br> 
          <strong> Book ID: <strong> ${book.id}  <br>
          which was placed on <strong> ${requestData.requestedOn} </strong> has been moved from hold to pickup. 
          Please ensure you arrive to retrieve it. </p>`,
        };
    
        await sgMail.send(tutorMsg).catch((error: unknown) => {
          console.error(error);
        });
    
        // Notify admins
        const admins = await prisma.user.findMany({
          where: { role: UserRole.Admin },
        });

        sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? "");

    if (admins) {
      
        admins.filter((admin) => {
          return admin.role === UserRole.Admin;
        })
        .map(async (user) => {
          const email = user.email;
          if (email) {
            const adminMsg = {
              to: email,
              from: "englishatlarge427@gmail.com",
              subject: `${user.email ?? "[No Username]"} Borrowed a Book`,

              text: `Borrower Name: ${user.email?? "[No Username]"} \n
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

      //compy
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
      //copy












    
        const adminEmails = admins.map((admin) => admin.email).filter(Boolean);

        if (adminEmails.length > 0) {
          const adminMsg = {
            to: adminEmails,
            from: "englishatlarge427@gmail.com",
            subject: `Waitlist Update: ${book.title} Moved to Pickup`,
            text: `A book request for "${book.title}" has been moved from hold to pickup. Please ensure proper handling in the system.`,
            html: `<p>A book request for <strong>${book.title}</strong> has been moved from hold to pickup. Please ensure proper handling in the system.</p>`
          };
    
          await sgMail.send(adminMsg).catch((error: unknown) => {
            console.error(error);
          });
        }
    }

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


