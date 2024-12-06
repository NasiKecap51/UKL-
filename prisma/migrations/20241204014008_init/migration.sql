-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `notlp` INTEGER NOT NULL DEFAULT 0,
    `role` ENUM('Admin', 'Peminjam') NOT NULL,
    `picture` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Items` (
    `id_item` INTEGER NOT NULL AUTO_INCREMENT,
    `item_name` VARCHAR(191) NOT NULL DEFAULT '',
    `category` ENUM('elektronik', 'alatTulis', 'peralatanOlahraga', 'yangLain') NOT NULL,
    `picture` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL DEFAULT '',

    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
