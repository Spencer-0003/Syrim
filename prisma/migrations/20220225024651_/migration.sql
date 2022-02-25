/*
  Warnings:

  - The `reputation` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReputationType" AS ENUM ('DEVELOPER', 'STAFF', 'CONTRIBUTOR', 'DONATOR', 'FRIEND', 'USER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "reputation",
ADD COLUMN "reputation" "ReputationType" NOT NULL DEFAULT E'USER';