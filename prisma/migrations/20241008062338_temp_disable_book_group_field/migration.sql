/*
  Warnings:

  - You are about to drop the column `groupId` on the `Books` table. All the data in the column will be lost.
  - You are about to drop the `BookGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_groupId_fkey";

-- AlterTable
ALTER TABLE "Books" DROP COLUMN "groupId";

-- DropTable
DROP TABLE "BookGroups";
