/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `Books` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Books" ALTER COLUMN "available" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Books_isbn_key" ON "Books"("isbn");
