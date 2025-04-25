import { prisma } from "@/lib/prisma";
import {
  BookStats,
  BookWithRequests,
  validateBookData,
} from "@/lib/util/types";
import {
  Book,
  BookLevel,
  BookRequest,
  BookSkills,
  Prisma,
  RequestStatus,
} from "@prisma/client";
/**
 * Utility controller that validates book fields, then creates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData without an "id" field
 * @remarks
 *  - This controller can later be modified to call other backend functions as needed.
 */
export const postBookController = async (
  bookData: Omit<Book, "id">
): Promise<BookWithRequests> => {
  // Validate required fields. Note that empty strings are also false values (so they can't be blank)
  try {
    if (!validateBookData(bookData)) {
      throw new Error("Missing required book properties");
    }
    const newBook = await prisma.book.create({
      data: bookData,
      include: {
        requests: true,
      },
    });

    return newBook;
  } catch (error) {
    console.error("Error Posting Books: ", error);
    throw error;
  }
};

//OLD

// export const getAllBooksController = async (): Promise<BookWithRequests[]> => {
//   try {
//     const Books = await prisma.book.findMany({
//       include: {
//         requests: true,
//       },
//     });

//     return Books;
//   } catch (error) {
//     console.error("Error fetching books: ", error);
//     throw error;
//   }
// };

//NEW
export const getAllBooksController = async (
  page: number = 0,
  limit: number = 0,
  withStats: boolean = false,
  fromDate?: Date,
  endDate?: Date,
  skills?: BookSkills[],
  levels?: BookLevel[],
  bookAvailable?: boolean,
  sortBy?: string,
  search?: string
): Promise<{
  books: (BookWithRequests | (BookWithRequests & BookStats))[];
  total: number;
  totalPages: number;
}> => {
  try {
    const skip = page > 0 && limit > 0 ? (page - 1) * limit : 0;

    if (bookAvailable) {
      const excludedStatuses = [
        RequestStatus.Returned,
        RequestStatus.Lost,
        RequestStatus.Hold,
      ];

      // Cast each excluded status to the enum
      const castedStatuses = excludedStatuses.map(
        (status) => Prisma.sql`${status}::"RequestStatus"`
      );

      // Inject into SQL:

      // RAW SQL path when availability matters
      const sortColumn =
        sortBy === "By Author"
          ? Prisma.sql`b.author`
          : sortBy === "By Release Date"
          ? Prisma.sql`b."releaseDate"`
          : Prisma.sql`b.title`; // default to title

      const rawBooks = await prisma.$queryRaw<
        (Book & { active_requests: number })[]
      >(
        Prisma.sql`
        SELECT b.*, 
               COUNT(r.id) FILTER (
                 WHERE r.status NOT IN (${Prisma.join(castedStatuses)})
               ) AS active_requests
        FROM "Books" b
        LEFT JOIN "BookRequests" r ON r."bookId" = b.id
        ${
          (skills && skills.length > 0) ||
          (levels && levels.length > 0) ||
          search
            ? Prisma.sql`WHERE 1=1
              ${
                skills && skills.length > 0
                  ? Prisma.sql`AND b.skills && ARRAY[${Prisma.join(
                      skills
                    )}]::"BookSkills"[]`
                  : Prisma.empty
              }
              ${
                levels && levels.length > 0
                  ? Prisma.sql`AND b.level IN (${Prisma.join(
                      levels.map((level) => Prisma.sql`${level}::"BookLevel"`)
                    )})`
                  : Prisma.empty
              }
              ${
                search
                  ? Prisma.sql`AND (
                      LOWER(b.title) LIKE ${`%${search.toLowerCase()}%`} OR
                      LOWER(b.author) LIKE ${`%${search.toLowerCase()}%`} OR
                      ${search} = ANY(b.isbn)
                    )`
                  : Prisma.empty
              }
            `
            : Prisma.empty
        }
        GROUP BY b.id
        HAVING b.copies > COUNT(r.id) FILTER (
          WHERE r.status NOT IN ('Returned', 'Lost', 'Hold')
        )
        ORDER BY ${sortColumn} ASC
        LIMIT ${limit} OFFSET ${skip};
      `
      );

      // Get total count for pagination with availability
      const [{ count }] = await prisma.$queryRaw<{ count: bigint }[]>(
        Prisma.sql`
        SELECT COUNT(*) as count
        FROM (
          SELECT b.id
          FROM "Books" b
          LEFT JOIN "BookRequests" r ON r."bookId" = b.id
          ${
            (skills && skills.length > 0) ||
            (levels && levels.length > 0) ||
            search
              ? Prisma.sql`WHERE 1=1
               ${
                 skills && skills.length > 0
                   ? Prisma.sql`AND b.skills && ARRAY[${Prisma.join(
                       skills
                     )}]::"BookSkills"[]`
                   : Prisma.empty
               }
                ${
                  levels && levels.length > 0
                    ? Prisma.sql`AND b.level IN (${Prisma.join(
                        levels.map((level) => Prisma.sql`${level}::"BookLevel"`)
                      )})`
                    : Prisma.empty
                }
                ${
                  search
                    ? Prisma.sql`AND (
                        LOWER(b.title) LIKE ${`%${search.toLowerCase()}%`} OR
                        LOWER(b.author) LIKE ${`%${search.toLowerCase()}%`} OR
                        ${search} = ANY(b.isbn)
                      )`
                    : Prisma.empty
                }
              `
              : Prisma.empty
          }
          GROUP BY b.id
          HAVING b.copies > COUNT(r.id) FILTER (
            WHERE r.status NOT IN ('Returned', 'Lost', 'Hold')
          )
        ) AS available_books;
      `
      );

      const bookIds = rawBooks.map((b) => b.id);

      const booksWithRequests = await prisma.book.findMany({
        where: { id: { in: bookIds } },
        include: { requests: true },
      });
      return {
        books: booksWithRequests,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      };
    } else {
      // Regular Prisma path when no availability filtering is needed
      const where: Prisma.BookWhereInput = {};

      if (fromDate && endDate) {
        const toEndOfDay = new Date(endDate);
        toEndOfDay.setHours(23, 59, 59, 999);
        where.createdAt = { gte: fromDate, lte: toEndOfDay };
      }

      if (skills && skills.length > 0) {
        where.skills = { hasSome: skills };
      }

      if (levels && levels.length > 0) {
        where.level = { in: levels };
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { author: { contains: search, mode: "insensitive" } },
          { isbn: { has: search } },
        ];
      }

      const orderBy: Prisma.BookOrderByWithRelationInput = {};
      switch (sortBy) {
        case "By Title":
          orderBy.title = "asc";
          break;
        case "By Author":
          orderBy.author = "asc";
          break;
        case "By Release Date":
          orderBy.releaseDate = "asc";
          break;
        default:
          orderBy.title = "asc";
      }

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          orderBy,
          skip,
          take: limit > 0 ? limit : undefined,
          include: {
            requests: withStats,
          },
        }),
        prisma.book.count({ where }),
      ]);

      const booksWithStats = withStats
        ? books.map((book) => {
            const totalRequests = book.requests.length;
            const uniqueUsers = new Set(book.requests.map((req) => req.userId))
              .size;
            return { ...book, totalRequests, uniqueUsers };
          })
        : books;

      return {
        books: booksWithStats,
        total,
        totalPages: Math.ceil(total / limit),
      };
    }
  } catch (error) {
    console.error("Error fetching books: ", error);
    throw error;
  }
};

export const getOneBookController = async (
  bookId: number
): Promise<BookWithRequests> => {
  try {
    if (bookId === undefined || bookId === null) {
      throw new Error("Missing book id");
    }

    const findBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        requests: true,
      },
    });

    if (findBook) return findBook;
    else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error fetching book: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData
 * @remarks
 *  - N/A
 */
export const putBookController = async (
  bookData: BookWithRequests
): Promise<BookWithRequests> => {
  try {
    if (!bookData.id || !validateBookData(bookData)) {
      throw new Error("Missing id, and name or owner");
    }

    const bookWithRequests = bookData as Book & { requests: BookRequest[] };

    const { requests, ...updatedBookData } = bookWithRequests;
    void requests;

    const updatedBook = await prisma.book.update({
      where: { id: updatedBookData.id },
      data: updatedBookData,
      include: {
        requests: true,
      },
    });

    if (updatedBook) {
      return updatedBook;
    } else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error Putting Book: ", error);
    throw error;
  }
};

/**
 * Utility controller that validates book fields, then updates a Book in backend.
 *
 * @returns bookData (with id) if book is valid, error otherwise
 * @params bookData
 * @remarks
 *  - N/A
 */
export const deleteBookController = async (bookId: number): Promise<Book> => {
  try {
    if (bookId === null || bookId === undefined) throw new Error("Invalid ID");

    const deletedBook = await prisma.book.delete({
      where: { id: bookId },
    });

    if (deletedBook) return deletedBook;
    else throw new Error("Book not found!");
  } catch (error) {
    console.error("Error deleting book", error);
    throw error;
  }
};
