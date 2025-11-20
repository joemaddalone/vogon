/*
  Warnings:

  - You are about to drop the column `addedAt` on the `JellyfinMovie` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `JellyfinMovie` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JellyfinMovie" (
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
INSERT INTO "new_JellyfinMovie" ("artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year") SELECT "artUrl", "contentRating", "duration", "guid", "id", "importedAt", "libraryKey", "rating", "ratingKey", "summary", "thumbUrl", "title", "year" FROM "JellyfinMovie";
DROP TABLE "JellyfinMovie";
ALTER TABLE "new_JellyfinMovie" RENAME TO "JellyfinMovie";
CREATE UNIQUE INDEX "JellyfinMovie_ratingKey_key" ON "JellyfinMovie"("ratingKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
