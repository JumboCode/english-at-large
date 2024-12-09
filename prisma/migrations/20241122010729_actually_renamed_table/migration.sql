/*
  Warnings:

  - You are about to drop the `Requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_bookId_fkey";

-- DropForeignKey
ALTER TABLE "Requests" DROP CONSTRAINT "Requests_userId_fkey";

-- DropTable
DROP TABLE "Requests";

-- CreateTable
CREATE TABLE "BookRequests" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "status" "BookStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "bookTitle" TEXT NOT NULL,

    CONSTRAINT "BookRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookRequests" ADD CONSTRAINT "BookRequests_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRequests" ADD CONSTRAINT "BookRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
