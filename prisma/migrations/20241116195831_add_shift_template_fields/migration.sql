/*
  Warnings:

  - Added the required column `title` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateName" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
