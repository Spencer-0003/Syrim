/*
  Warnings:

  - The primary key for the `Guild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `guildId` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `discordId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Guild_guildId_key";

-- DropIndex
DROP INDEX "User_discordId_key";

-- AlterTable
ALTER TABLE "Guild" DROP CONSTRAINT "Guild_pkey",
DROP COLUMN "guildId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Guild_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Guild_id_seq";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordId",
ADD COLUMN     "bio" TEXT NOT NULL DEFAULT E'No bio set.';
