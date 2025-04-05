import { User, BookRequest } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { UserWithRequests, validateUserData } from "@/lib/util/types";
import clerkClient from "@/clerk";

// export const getAllUsersController = async (): Promise<User[]> => {
//   try {

//     const users = await prisma.user.findMany({
//       include: {
//         requests: true,
//       },
//     });
//     return users;
//   } catch (error) {
//     console.error("Error fetching users: ", error);
//     throw error;
//   }
// };

export const getAllUsersController = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  users: UserWithRequests[];
  total: number;
  totalPages: number;
}> => {
  try {
    // Calculate the offset (skip) for pagination
    const skip = (page - 1) * limit;

    // Fetch paginated users and total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: skip,
        take: limit,
        include: {
          requests: true,
        },
      }),
      prisma.user.count(),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return { users, total, totalPages };
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
};

export const getOneUserController = async (id: string): Promise<User> => {
  try {
    const user = await prisma.user.findUnique({
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
      if (!user.pending) {
        await clerkClient.users.deleteUser(user.clerkId);
      } else if (user.inviteID) {
        await clerkClient.invitations.revokeInvitation(user.inviteID);
      }

      console.log(user);

      return await prisma.user.delete({
        where: { id: id },
      });
    }
  } catch (error) {
    console.error("Error deleting user", error);
    throw error;
  }
};
