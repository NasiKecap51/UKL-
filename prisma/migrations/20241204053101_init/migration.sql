/*
  Warnings:

  - You are about to drop the column `quantity` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `quantity`,
    ADD COLUMN `quantitys` INTEGER NOT NULL DEFAULT 0;
