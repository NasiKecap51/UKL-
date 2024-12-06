/*
  Warnings:

  - You are about to alter the column `notlp` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `Int`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `notlp` INTEGER NOT NULL DEFAULT 0;
