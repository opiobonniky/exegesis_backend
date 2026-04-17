-- CreateEnum
CREATE TYPE "WatchlistStatus" AS ENUM ('PLANNED', 'WATCHING', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "releaseYear" INTEGER NOT NULL,
    "genre" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "posterUrl" TEXT NOT NULL,
    "runTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "status" "WatchlistStatus" NOT NULL DEFAULT 'PLANNED',
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Movie_createdById_idx" ON "Movie"("createdById");

-- CreateIndex
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");

-- CreateIndex
CREATE INDEX "Watchlist_movieId_idx" ON "Watchlist"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_movieId_key" ON "Watchlist"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
