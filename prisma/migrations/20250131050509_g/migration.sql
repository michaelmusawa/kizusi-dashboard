-- DropForeignKey
ALTER TABLE "CategoryBrand" DROP CONSTRAINT "CategoryBrand_brandId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryBrand" DROP CONSTRAINT "CategoryBrand_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "CategoryBrand" ADD CONSTRAINT "CategoryBrand_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryBrand" ADD CONSTRAINT "CategoryBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
