/*
  Warnings:

  - You are about to drop the column `addedAt` on the `JellyfinShow` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `JellyfinShow` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `PlexMovie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PlexMovie` table. All the data in the column will be lost.
  - You are about to drop the column `addedAt` on the `PlexShow` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PlexShow` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JellyfinShow" (
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
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_JellyfinShow" ("artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year") SELECT "artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year" FROM "JellyfinShow";
DROP TABLE "JellyfinShow";
ALTER TABLE "new_JellyfinShow" RENAME TO "JellyfinShow";
CREATE UNIQUE INDEX "JellyfinShow_ratingKey_key" ON "JellyfinShow"("ratingKey");
CREATE TABLE "new_PlexMovie" (
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
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PlexMovie" ("artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year") SELECT "artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year" FROM "PlexMovie";
DROP TABLE "PlexMovie";
ALTER TABLE "new_PlexMovie" RENAME TO "PlexMovie";
CREATE UNIQUE INDEX "PlexMovie_ratingKey_key" ON "PlexMovie"("ratingKey");
CREATE TABLE "new_PlexShow" (
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
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PlexShow" ("artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year") SELECT "artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year" FROM "PlexShow";
DROP TABLE "PlexShow";
ALTER TABLE "new_PlexShow" RENAME TO "PlexShow";
CREATE UNIQUE INDEX "PlexShow_ratingKey_key" ON "PlexShow"("ratingKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
