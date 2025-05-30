-- CreateTable
CREATE TABLE "StravaAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stravaId" TEXT NOT NULL,
    "username" TEXT,
    "resourceState" INTEGER,
    "firstname" TEXT,
    "lastname" TEXT,
    "bio" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "sex" TEXT,
    "premium" BOOLEAN,
    "summit" BOOLEAN,
    "createdAtStrava" TIMESTAMP(3),
    "updatedAtStrava" TIMESTAMP(3),
    "badgeTypeId" INTEGER,
    "weight" INTEGER,
    "profile" TEXT,
    "profileMedium" TEXT,
    "friend" INTEGER,
    "follower" INTEGER,
    "blocked" BOOLEAN,
    "canFollow" BOOLEAN,
    "followerCount" INTEGER,
    "friendCount" INTEGER,
    "mutualFriendCount" INTEGER,
    "athleteType" INTEGER,
    "datePreference" TEXT,
    "measurementPreference" TEXT,
    "postableClubsCount" INTEGER,
    "isWinbackViaUpload" BOOLEAN,
    "isWinbackViaView" BOOLEAN,
    "clubs" JSONB,
    "shoes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StravaAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StravaAccount_userId_key" ON "StravaAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StravaAccount_stravaId_key" ON "StravaAccount"("stravaId");

-- AddForeignKey
ALTER TABLE "StravaAccount" ADD CONSTRAINT "StravaAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
