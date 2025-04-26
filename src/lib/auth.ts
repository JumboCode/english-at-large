import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOneRequestController } from "@/app/api/requests/controller";

export async function requireUserWithRole(expectedRoles?: string | string[]) {
  const { userId: clerkId } = await auth();

  if (!clerkId) throw new Error("Not authenticated");

  const user = await prisma.user.findFirst({
    where: { clerkId },
  });

  if (!user) throw new Error("User not found");

  if (!expectedRoles?.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function requireUserWithRoleForRequestDelete(requestId: number) {
  const { userId: clerkId } = await auth();

  if (!clerkId) throw new Error("Not authenticated");

  const user = await prisma.user.findFirst({
    where: { clerkId },
  });

  if (!user) throw new Error("User not found");

  if (user.role === "Tutor") {
    const request = await getOneRequestController(requestId);
    if (request.userId != user.id) {
      throw new Error("Forbidden");
    }
  }

  return user;
}

export async function requireUserWithRoleOrInvite(
  expectedRoles?: string | string[],
  allowNewUser = false
) {
  const { userId: clerkId } = await auth();

  if (!clerkId) throw new Error("Not authenticated");

  const user = await prisma.user.findFirst({ where: { clerkId } });

  if (!user) {
    if (allowNewUser) {
      // Allow if we're intentionally letting invited, not-yet-in-DB users through
      return { clerkId, role: "Invited" };
    }
    throw new Error("User not found");
  }

  if (!expectedRoles?.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
