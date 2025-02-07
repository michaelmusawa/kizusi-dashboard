/*
  Warnings:

  - You are about to drop the `_BrandToCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BrandToCategory" DROP CONSTRAINT "_BrandToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BrandToCategory" DROP CONSTRAINT "_BrandToCategory_B_fkey";

-- DropTable
DROP TABLE "_BrandToCategory";

-- CreateTable
CREATE TABLE "CategoryBrand" (
    "categoryId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "CategoryBrand_pkey" PRIMARY KEY ("categoryId","brandId")
);

-- AddForeignKey
ALTER TABLE "CategoryBrand" ADD CONSTRAINT "CategoryBrand_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryBrand" ADD CONSTRAINT "CategoryBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
