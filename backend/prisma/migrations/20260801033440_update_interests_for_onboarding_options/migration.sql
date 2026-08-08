/*
  Warnings:

  - You are about to drop the column `label_ko` on the `interests` table. All the data in the column will be lost.
  - Added the required column `detail_placeholder_ja` to the `interests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail_question_ja` to the `interests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "interests" DROP COLUMN "label_ko",
ADD COLUMN     "detail_placeholder_ja" VARCHAR(255) NOT NULL,
ADD COLUMN     "detail_question_ja" VARCHAR(255) NOT NULL;
