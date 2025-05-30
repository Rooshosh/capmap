-- CreateTable
CREATE TABLE "ActivityTrack" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "track" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActivityTrack_activityId_key" ON "ActivityTrack"("activityId");

-- AddForeignKey
ALTER TABLE "ActivityTrack" ADD CONSTRAINT "ActivityTrack_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "DetailedActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
