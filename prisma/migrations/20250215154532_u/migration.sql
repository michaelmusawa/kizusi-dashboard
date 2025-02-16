/*
  Warnings:

  - Added the required column `departureLatitude` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureLongitude` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "departureLatitude" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "departureLongitude" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "destinationLatitude" DECIMAL(10,2),
ADD COLUMN     "destinationLongitude" DECIMAL(10,2),
ALTER COLUMN "destination" DROP NOT NULL;
