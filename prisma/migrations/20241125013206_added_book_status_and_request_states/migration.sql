/*
  Warnings:

  - Added the required column `requestedOn` to the `BookRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnedBy` to the `BookRequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BookStatus" ADD VALUE 'Pickup';
ALTER TYPE "BookStatus" ADD VALUE 'Returned';

-- AlterTable
ALTER TABLE "BookRequests" ADD COLUMN     "requestedOn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnedBy" TIMESTAMP(3) NOT NULL;
