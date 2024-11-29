/*
  Warnings:

  - You are about to drop the column `postal_code` on the `recipients` table. All the data in the column will be lost.
  - Added the required column `zip_code` to the `recipients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipients" DROP COLUMN "postal_code",
ADD COLUMN     "zip_code" TEXT NOT NULL;
