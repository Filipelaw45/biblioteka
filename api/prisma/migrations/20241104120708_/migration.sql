/*
  Warnings:

  - You are about to drop the column `queueReservation` on the `Books` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Books" DROP COLUMN "queueReservation";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "queueReservation" TEXT[];
