/*
  Warnings:

  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `bookType` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "status",
ADD COLUMN     "bookType" TEXT NOT NULL,
ADD COLUMN     "bookingStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';
