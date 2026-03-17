/*
  Warnings:

  - You are about to drop the column `status` on the `articles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `articles_status_idx` ON `articles`;

-- AlterTable
ALTER TABLE `articles` DROP COLUMN `status`;
