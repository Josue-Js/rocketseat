/*
  Warnings:

  - You are about to drop the column `password` on the `Org` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `Org` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Org` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `energia` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `level_of_independence` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SHORT', 'MEDIUM_SIZED', 'TALL');

-- CreateEnum
CREATE TYPE "Energia" AS ENUM ('LAZY', 'LOW', 'MEDIUM', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "Independence" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Org" DROP COLUMN "password",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "pets" ALTER COLUMN "about" DROP NOT NULL,
DROP COLUMN "size",
ADD COLUMN     "size" "Size" NOT NULL,
DROP COLUMN "energia",
ADD COLUMN     "energia" "Energia" NOT NULL,
DROP COLUMN "level_of_independence",
ADD COLUMN     "level_of_independence" "Independence" NOT NULL,
ALTER COLUMN "requirements" SET DEFAULT ARRAY[]::TEXT[];

-- DropEnum
DROP TYPE "Height";
