/*
  Warnings:

  - Added the required column `sessionId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL
);
INSERT INTO "new_Transactions" ("amount", "id", "title", "type") SELECT "amount", "id", "title", "type" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
