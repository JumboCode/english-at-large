import { prisma } from "@/lib/prisma";

/**
 * Utility controller that gets the number of requests in the backend.
 *
 * @returns the count of the requests in the requests Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 *  - TODO: modify to be able to specify a date range. still use the count() function when possible
 */
export const getRequestsCountController = async (): Promise<number> => {
  try {
    const requests = await prisma.bookRequest.count();
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    throw error;
  }
};
