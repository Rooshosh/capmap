/*
  Warnings:

  - A unique constraint covering the columns `[stravaId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stravaId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stravaId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_stravaId_key" ON "User"("stravaId");
