/*
  Warnings:

  - You are about to drop the column `stravaId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_stravaId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stravaId";
