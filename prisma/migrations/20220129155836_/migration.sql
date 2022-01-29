-- CreateEnum
CREATE TYPE "BlacklistType" AS ENUM ('GUILD', 'USER');

-- CreateTable
CREATE TABLE "Blacklist" (
    "id" TEXT NOT NULL,
    "type" "BlacklistType" NOT NULL,
    "moderator" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Blacklist_pkey" PRIMARY KEY ("id")
);