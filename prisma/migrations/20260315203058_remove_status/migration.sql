/*
  Warnings:

  - You are about to drop the column `createdAt` on the `articles` table. All the data in the column will be lost.
  - Made the column `publishedAt` on table `articles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `articles` DROP COLUMN `createdAt`,
    MODIFY `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
