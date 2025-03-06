// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use a global instance to avoid multiple connections during development (Next.js Hot Reload)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient().$extends({
    query: {
      book: {
        // async findMany({ model, operation, args, query }) {
        //   console.log("finding many");
        //   return query(args);
        // },
        // async findUnique({ model, operation, args, query }) {
        //   console.log("finding unique");

        //   return query(args);
        // },
        async update({ model, operation, args, query }) {
          console.log("updating");
          return query(args);
        },
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
