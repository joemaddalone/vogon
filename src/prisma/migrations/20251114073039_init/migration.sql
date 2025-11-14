/*
  Warnings:

  - You are about to drop the column `art` on the `PlexSeason` table. All the data in the column will be lost.
  - You are about to drop the column `thumb` on the `PlexSeason` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlexSeason" (
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
INSERT INTO "new_PlexSeason" ("id", "index", "parentKey", "parentRatingKey", "parentTheme", "parentThumb", "parentTitle", "ratingKey", "summary", "title", "type", "year") SELECT "id", "index", "parentKey", "parentRatingKey", "parentTheme", "parentThumb", "parentTitle", "ratingKey", "summary", "title", "type", "year" FROM "PlexSeason";
DROP TABLE "PlexSeason";
ALTER TABLE "new_PlexSeason" RENAME TO "PlexSeason";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
