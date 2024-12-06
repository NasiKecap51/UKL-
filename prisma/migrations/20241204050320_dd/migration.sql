/*
  Warnings:

  - You are about to drop the column `description` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `description`,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 0;
