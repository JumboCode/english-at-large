/*
  Warnings:

  - You are about to drop the column `name` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `groupId` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scanLink` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Books" DROP COLUMN "name",
DROP COLUMN "owner",
ADD COLUMN     "booktype" TEXT[],
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "isbn" TEXT NOT NULL,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "scanLink" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "BookGroups" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "BookGroups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "bookTitle" TEXT NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Books"("id") ON DELETE CASCADE ON UPDATE CASCADE;
