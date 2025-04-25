import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireUserWithRole(expectedRoles?: string | string[]) {
  const { userId: clerkId } = await auth();

  if (!clerkId) throw new Error("Not authenticated");

  const user = await prisma.user.findFirst({
    where: { clerkId },
  });
  if (!user) throw new Error("User not found");

  if (expectedRoles) {
    const rolesArray = Array.isArray(expectedRoles)
      ? expectedRoles
      : [expectedRoles];
    if (!rolesArray.includes(user.role)) {
      throw new Error("Forbidden");
    }
  }

  return user;
}
