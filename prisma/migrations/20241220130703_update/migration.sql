/*
  Warnings:

  - You are about to drop the column `hashRTN` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `hashRTN`,
    ADD COLUMN `hashRT` VARCHAR(191) NULL;
