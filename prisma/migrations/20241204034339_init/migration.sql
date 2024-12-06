/*
  Warnings:

  - You are about to drop the column `notlp` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `notlp`,
    ADD COLUMN `nomorTLP` INTEGER NOT NULL DEFAULT 0;
