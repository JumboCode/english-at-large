/*
  Warnings:

  - The `status` column on the `Books` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `author` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publisher` to the `Books` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `booktype` on the `Books` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level` on the `Books` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Volunteer', 'Tutor');

-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('Available', 'Requested', 'Borrowed', 'Lost');

-- CreateEnum
CREATE TYPE "BookSkills" AS ENUM ('Grammar', 'Vocab_Building', 'Reading', 'Writing', 'Speaking', 'Listening', 'Pronounciation');

-- CreateEnum
CREATE TYPE "BookType" AS ENUM ('Reference', 'Volunteer_Resource', 'Standalone', 'Series');

-- CreateEnum
CREATE TYPE "BookLevel" AS ENUM ('Beginner', 'High_Beginner', 'Low_Intermediate', 'Intermediate', 'High_Intermediate', 'Advanced');

-- AlterTable
ALTER TABLE "Books" ADD COLUMN     "author" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "publisher" TEXT NOT NULL,
ADD COLUMN     "releaseDate" TEXT,
ADD COLUMN     "skills" "BookSkills"[],
DROP COLUMN "booktype",
ADD COLUMN     "booktype" "BookType" NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "BookLevel" NOT NULL,
ALTER COLUMN "scanLink" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BookStatus" NOT NULL DEFAULT 'Available';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;
