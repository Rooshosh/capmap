-- AlterTable
ALTER TABLE "DetailedActivity" ADD COLUMN     "fakeUserId" TEXT;

-- CreateTable
CREATE TABLE "FakeUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "FakeUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetailedActivity" ADD CONSTRAINT "DetailedActivity_fakeUserId_fkey" FOREIGN KEY ("fakeUserId") REFERENCES "FakeUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
