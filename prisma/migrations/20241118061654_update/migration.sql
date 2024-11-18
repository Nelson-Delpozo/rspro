/*
  Warnings:

  - You are about to drop the column `isTemplate` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `templateName` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Shift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "isTemplate",
DROP COLUMN "templateName",
DROP COLUMN "title";
