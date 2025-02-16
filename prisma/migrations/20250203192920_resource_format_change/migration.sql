/*
  Warnings:

  - The values [PDF,Article,Image,Website] on the enum `ResourceFormat` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceFormat_new" AS ENUM ('Worksheet', 'Reading', 'Video');
ALTER TABLE "OnlineResources" ALTER COLUMN "format" TYPE "ResourceFormat_new" USING ("format"::text::"ResourceFormat_new");
ALTER TYPE "ResourceFormat" RENAME TO "ResourceFormat_old";
ALTER TYPE "ResourceFormat_new" RENAME TO "ResourceFormat";
DROP TYPE "ResourceFormat_old";
COMMIT;
