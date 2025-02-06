/*
  Warnings:

  - You are about to drop the `OnlineResource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OnlineResource";

-- CreateTable
CREATE TABLE "OnlineResources" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "level" "BookLevel" NOT NULL,
    "topic" "ResourceTopic" NOT NULL,
    "skills" "BookSkills"[],
    "format" "ResourceFormat" NOT NULL,

    CONSTRAINT "OnlineResources_pkey" PRIMARY KEY ("id")
);
