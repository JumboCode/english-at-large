import { User, BookRequest, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserWithRequests, validateUserData } from "@/lib/util/types";
import clerkClient from "@/clerk";

// added date filtering on requests for each user
export const getAllUsersController = async (
  page: number = 0,
  limit: number = 0,
  fromDate?: Date,
  endDate?: Date,
  search?: string,
  filterUsersWithoutRequests: boolean = false
): Promise<{
  users: UserWithRequests[];
  total: number;
  totalPages: number;
}> => {
  try {
    const noFilters = !page && !limit && !search && !filterUsersWithoutRequests;

    if (noFilters) {
      const allUsers = await prisma.user.findMany({
        include: { requests: true },
      });
      return {
        users: allUsers,
        total: allUsers.length,
        totalPages: 1,
      };
    }

    // Calculate the offset (skip) for pagination
    const skip = page > 0 && limit > 0 ? (page - 1) * limit : 0;
    // build the query
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (fromDate && endDate) {
      const toEndOfDay = new Date(endDate);
      toEndOfDay.setHours(23, 59, 59, 999);

      where.requests = {
        some: {
          requestedOn: { gte: fromDate, lte: toEndOfDay },
        },
      };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit > 0 ? limit : undefined,
        include: {
          requests: {
            where:
              fromDate && endDate
                ? {
                    requestedOn: {
                      gte: fromDate,
                      lte: new Date(endDate.setHours(23, 59, 59, 999)),
                    },
                  }
                : undefined,
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const usersWithRequests = users.filter((user) => user.requests.length > 0);
    return {
      users: filterUsersWithoutRequests ? usersWithRequests : users,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const getOneUserController = async (
  id: string
): Promise<UserWithRequests> => {
  try {
    const user: UserWithRequests | null = await prisma.user.findUnique({
      where: { id: id },
      include: {
        requests: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw error;
  }
};

export const getOneUserByClerkController = async (
  clerkId: string
): Promise<User> => {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: clerkId },
      include: {
        requests: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    throw error;
  }
};

export const postUserController = async (
  userData: Omit<User, "id">
): Promise<User> => {
  try {
    // Validate required fields
    if (!validateUserData(userData)) {
      throw new Error("Missing required user properties");
    }

    // Create the new user in the datry tabase
    const newUser = await prisma.user.create({
      data: userData,
      include: {
        requests: true,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error in postUserController:", error);
    throw error; // Let the calling function handle the error and response
  }
};

export const putUserController = async (userData: User): Promise<User> => {
  try {
    if (!userData.id || !validateUserData(userData)) {
      throw new Error("Missing id, and name or owner");
    }

    const userWithRequests = userData as User & { requests: BookRequest[] };

    const { requests, ...updatedUserData } = userWithRequests;
    void requests;

    const updatedUser = await prisma.user.update({
      where: { id: updatedUserData.id },
      data: updatedUserData,
      include: {
        requests: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user", error);
    throw error;
  }
};

export const deleteUserController = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new Error("User not found");
    } else {
      try {
        if (!user.pending) {
          await clerkClient.users.deleteUser(user.clerkId);
        } else if (user.inviteID) {
          await clerkClient.invitations.revokeInvitation(user.inviteID);
        } else {
          console.warn(`Invitation ${user.inviteID} cannot be revoked`);
        }
      } catch {
        console.error("Failed to revoke invitation:");
      }

      return await prisma.user.delete({
        where: { id: id },
      });
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};
