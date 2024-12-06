/*
  Warnings:

  - The values [elektronik,alatTulis,peralatanOlahraga,yangLain] on the enum `Items_category` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updateAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `category` ENUM('Elektronik', 'AlatTulis', 'PeralatanOlahraga', 'YangLain') NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Request` (
    `borrowId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualReturnDate` DATETIME(3) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'BORROWED',

    INDEX `Request_borrowDate_idx`(`borrowDate`),
    INDEX `Request_actualReturnDate_idx`(`actualReturnDate`),
    INDEX `Request_status_idx`(`status`),
    PRIMARY KEY (`borrowId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Items`(`id_item`) ON DELETE CASCADE ON UPDATE CASCADE;
