/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_bookId_key" ON "Reservation"("userId", "bookId");
