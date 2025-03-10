import { fetchFilteredCategories } from "@/app/lib/action";
import Link from "next/link";
import React from "react";
import { CategoryCard } from "../car/carCard";

const CategoriesDisplay = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const categories = await fetchFilteredCategories(query, currentPage);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories?.map((category) => (
        <Link
          key={category.categoryId}
          href={`/dashboard/categories/${category.categoryId}/display`}
        >
          <CategoryCard key={category.categoryId} {...category} />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesDisplay;
