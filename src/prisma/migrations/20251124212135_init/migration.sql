-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "artUrl" TEXT,
    "contentRating" TEXT,
    "duration" INTEGER,
    "guid" TEXT,
    "index" INTEGER,
    "libraryKey" TEXT,
    "parentIndex" INTEGER,
    "parentKey" TEXT,
    "parentRatingKey" TEXT,
    "parentTheme" TEXT,
    "parentThumb" TEXT,
    "parentTitle" TEXT,
    "rating" REAL,
    "ratingKey" TEXT NOT NULL,
    "summary" TEXT,
    "thumbUrl" TEXT,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,
    "year" INTEGER,
    "serverId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Media_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdbApiKey" TEXT,
    "fanartApiKey" TEXT,
    "removeOverlays" INTEGER NOT NULL DEFAULT 0,
    "thePosterDbEmail" TEXT,
    "thePosterDbPassword" TEXT
);

-- CreateTable
CREATE TABLE "Server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userid" TEXT,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverId" INTEGER NOT NULL,
    CONSTRAINT "Session_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
