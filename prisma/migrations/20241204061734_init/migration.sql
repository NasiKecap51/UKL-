/*
  Warnings:

  - You are about to drop the column `quantitz` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `quantitz`,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 0;
