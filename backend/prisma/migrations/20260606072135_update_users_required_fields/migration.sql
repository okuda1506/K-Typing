/*
  Warnings:

  - You are about to alter the column `display_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `display_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "display_name" SET NOT NULL,
ALTER COLUMN "display_name" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
