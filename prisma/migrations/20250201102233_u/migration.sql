/*
  Warnings:

  - Added the required column `amount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;
