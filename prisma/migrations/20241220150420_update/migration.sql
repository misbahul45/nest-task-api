/*
  Warnings:

  - You are about to drop the column `statusId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `taskstatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_statusId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `statusId`,
    ADD COLUMN `status` ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TODO';

-- DropTable
DROP TABLE `taskstatus`;
