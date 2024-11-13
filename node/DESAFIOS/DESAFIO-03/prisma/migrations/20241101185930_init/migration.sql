-- CreateEnum
CREATE TYPE "Age" AS ENUM ('PUPPY', 'YOUNG', 'ADULT');

-- CreateEnum
CREATE TYPE "Height" AS ENUM ('SHORT', 'MEDIUM_SIZED', 'TALL');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('LITTLE', 'MEDIUM', 'LARGE');

-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL,
    "name_of_person_responsible" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" "Age" NOT NULL,
    "size" "Height" NOT NULL,
    "energia" INTEGER NOT NULL,
    "level_of_independence" INTEGER NOT NULL,
    "environment" "Environment" NOT NULL,
    "requirements" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "org_id" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pet_id" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Org_id_key" ON "Org"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Org_email_key" ON "Org"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pets_id_key" ON "pets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "photos_id_key" ON "photos"("id");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
