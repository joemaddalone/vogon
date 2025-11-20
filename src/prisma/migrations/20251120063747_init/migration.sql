/*
  Warnings:

  - You are about to drop the column `itemId` on the `JellyfinEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `providerIds` on the `JellyfinEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `JellyfinEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `seriesId` on the `JellyfinEpisode` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `JellyfinMovie` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `JellyfinMovie` table. All the data in the column will be lost.
  - You are about to drop the column `libraryId` on the `JellyfinMovie` table. All the data in the column will be lost.
  - You are about to drop the column `providerIds` on the `JellyfinMovie` table. All the data in the column will be lost.
  - You are about to drop the column `importedAt` on the `JellyfinSeason` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `JellyfinSeason` table. All the data in the column will be lost.
  - You are about to drop the column `providerIds` on the `JellyfinSeason` table. All the data in the column will be lost.
  - You are about to drop the column `seriesId` on the `JellyfinSeason` table. All the data in the column will be lost.
  - You are about to drop the column `seriesName` on the `JellyfinSeason` table. All the data in the column will be lost.
  - You are about to drop the column `dateCreated` on the `JellyfinShow` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `JellyfinShow` table. All the data in the column will be lost.
  - You are about to drop the column `libraryId` on the `JellyfinShow` table. All the data in the column will be lost.
  - You are about to drop the column `providerIds` on the `JellyfinShow` table. All the data in the column will be lost.
  - Added the required column `parentRatingKey` to the `JellyfinEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingKey` to the `JellyfinEpisode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedAt` to the `JellyfinMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libraryKey` to the `JellyfinMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingKey` to the `JellyfinMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JellyfinMovie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentKey` to the `JellyfinSeason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentRatingKey` to the `JellyfinSeason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingKey` to the `JellyfinSeason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedAt` to the `JellyfinShow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libraryKey` to the `JellyfinShow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratingKey` to the `JellyfinShow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JellyfinShow` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JellyfinEpisode" (
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
INSERT INTO "new_JellyfinEpisode" ("duration", "id", "importedAt", "index", "parentIndex", "summary", "thumbUrl", "title", "year") SELECT "duration", "id", "importedAt", "index", "parentIndex", "summary", "thumbUrl", "title", "year" FROM "JellyfinEpisode";
DROP TABLE "JellyfinEpisode";
ALTER TABLE "new_JellyfinEpisode" RENAME TO "JellyfinEpisode";
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
    "addedAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_JellyfinMovie" ("artUrl", "contentRating", "duration", "id", "importedAt", "rating", "summary", "thumbUrl", "title", "year") SELECT "artUrl", "contentRating", "duration", "id", "importedAt", "rating", "summary", "thumbUrl", "title", "year" FROM "JellyfinMovie";
DROP TABLE "JellyfinMovie";
ALTER TABLE "new_JellyfinMovie" RENAME TO "JellyfinMovie";
CREATE UNIQUE INDEX "JellyfinMovie_ratingKey_key" ON "JellyfinMovie"("ratingKey");
CREATE TABLE "new_JellyfinSeason" (
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
INSERT INTO "new_JellyfinSeason" ("artUrl", "id", "index", "parentThumb", "summary", "thumbUrl", "title", "type", "year") SELECT "artUrl", "id", "index", "parentThumb", "summary", "thumbUrl", "title", "type", "year" FROM "JellyfinSeason";
DROP TABLE "JellyfinSeason";
ALTER TABLE "new_JellyfinSeason" RENAME TO "JellyfinSeason";
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
    "addedAt" INTEGER NOT NULL,
    "updatedAt" INTEGER NOT NULL,
    "guid" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_JellyfinShow" ("artUrl", "contentRating", "duration", "id", "importedAt", "rating", "summary", "thumbUrl", "title", "year") SELECT "artUrl", "contentRating", "duration", "id", "importedAt", "rating", "summary", "thumbUrl", "title", "year" FROM "JellyfinShow";
DROP TABLE "JellyfinShow";
ALTER TABLE "new_JellyfinShow" RENAME TO "JellyfinShow";
CREATE UNIQUE INDEX "JellyfinShow_ratingKey_key" ON "JellyfinShow"("ratingKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
