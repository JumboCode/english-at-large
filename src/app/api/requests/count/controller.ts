import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Utility controller that gets the number of requests in the backend.
 *
 * @returns the count of the requests in the requests Database
 * @params None
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 *  - TODO: modify to be able to specify a date range. still use the count() function when possible
 */
export const getRequestsCountController = async (
  fromDate?: Date,
  endDate?: Date
): Promise<number> => {
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

    const requests = await prisma.bookRequest.count({ where });
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    throw error;
  }
};
