-- CreateTable
CREATE TABLE "PlexMovie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ratingKey" TEXT NOT NULL,
    "libraryKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "summary" TEXT,
    "thumbUrl" TEXT,
    "artUrl" TEXT,
    "duration" INTEGER,
    "rating" REAL,
    "contentRating" TEXT,
    "addedAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlexShow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ratingKey" TEXT NOT NULL,
    "libraryKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER,
    "summary" TEXT,
    "thumbUrl" TEXT,
    "artUrl" TEXT,
    "duration" INTEGER,
    "rating" REAL,
    "contentRating" TEXT,
    "addedAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plexServerUrl" TEXT,
    "plexToken" TEXT,
    "tmdbApiKey" TEXT,
    "fanartApiKey" TEXT,
    "removeOverlays" INTEGER NOT NULL DEFAULT 0,
    "thePosterDbEmail" TEXT,
    "thePosterDbPassword" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "PlexMovie_ratingKey_key" ON "PlexMovie"("ratingKey");

-- CreateIndex
CREATE UNIQUE INDEX "PlexShow_ratingKey_key" ON "PlexShow"("ratingKey");
