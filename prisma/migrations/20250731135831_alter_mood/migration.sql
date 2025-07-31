/*
  Warnings:

  - You are about to drop the column `mood` on the `Interactions` table. All the data in the column will be lost.
  - Added the required column `tone` to the `Interactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Interactions" DROP COLUMN "mood",
ADD COLUMN     "tone" TEXT NOT NULL;
