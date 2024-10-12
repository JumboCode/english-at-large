-- DropForeignKey
ALTER TABLE "Books" DROP CONSTRAINT "Books_groupId_fkey";

-- AlterTable
ALTER TABLE "Books" ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Books" ADD CONSTRAINT "Books_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "BookGroups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
