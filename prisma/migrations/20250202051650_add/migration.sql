-- CreateEnum
CREATE TYPE "ResourceTopic" AS ENUM ('Holidays', 'Culture');

-- CreateEnum
CREATE TYPE "ResourceFormat" AS ENUM ('PDF', 'Video', 'Article', 'Image', 'Website');

-- CreateTable
CREATE TABLE "OnlineResource" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "level" "BookLevel" NOT NULL,
    "topic" "ResourceTopic" NOT NULL,
    "skills" "BookSkills"[],
    "format" "ResourceFormat" NOT NULL,

    CONSTRAINT "OnlineResource_pkey" PRIMARY KEY ("id")
);
