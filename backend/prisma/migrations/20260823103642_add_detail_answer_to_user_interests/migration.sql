/*
  Warnings:

  - Added the required column `detail_answer` to the `user_interests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_interests" ADD COLUMN     "detail_answer" VARCHAR(255) NOT NULL;
