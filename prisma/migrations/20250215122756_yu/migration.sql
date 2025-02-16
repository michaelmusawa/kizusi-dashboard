/*
  Warnings:

  - You are about to drop the column `name` on the `Addon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[carId,addonName]` on the table `Addon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addonName` to the `Addon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addonValue` to the `Addon` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Addon_carId_name_key";

-- AlterTable
ALTER TABLE "Addon" DROP COLUMN "name",
ADD COLUMN     "addonName" TEXT NOT NULL,
ADD COLUMN     "addonValue" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Addon_carId_addonName_key" ON "Addon"("carId", "addonName");
