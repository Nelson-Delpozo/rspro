-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateName" TEXT;
