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
CREATE TABLE "PlexEpisode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ratingKey" TEXT NOT NULL,
    "parentRatingKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "index" INTEGER,
    "parentIndex" INTEGER,
    "year" INTEGER,
    "summary" TEXT,
    "thumbUrl" TEXT,
    "artUrl" TEXT,
    "duration" INTEGER,
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PlexSeason" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ratingKey" TEXT NOT NULL,
    "parentRatingKey" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "parentKey" TEXT NOT NULL,
    "parentTitle" TEXT,
    "summary" TEXT,
    "index" INTEGER,
    "year" INTEGER,
    "thumbUrl" TEXT,
    "artUrl" TEXT,
    "parentThumb" TEXT,
    "parentTheme" TEXT
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plexServerUrl" TEXT,
    "plexToken" TEXT,
    "jellyfinServerUrl" TEXT,
    "jellyfinApiKey" TEXT,
    "jellyfinUserId" TEXT,
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
