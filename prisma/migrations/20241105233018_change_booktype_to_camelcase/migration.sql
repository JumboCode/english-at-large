/*
  Warnings:

  - You are about to drop the column `booktype` on the `Books` table. All the data in the column will be lost.
  - Added the required column `bookType` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" RENAME COLUMN "booktype" TO "bookType";

