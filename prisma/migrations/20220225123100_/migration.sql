-- AlterTable
ALTER TABLE "User" ADD COLUMN     "attributes" TEXT NOT NULL DEFAULT E'{}',
ADD COLUMN "visibleInAPI" BOOLEAN NOT NULL DEFAULT true;