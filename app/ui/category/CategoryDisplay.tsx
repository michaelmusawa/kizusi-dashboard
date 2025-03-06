import Image from "next/image";
import Link from "next/link";
import { CategoryState } from "@/app/lib/definitions";

const CategoryDisplay = ({ category }: { category: CategoryState }) => {
  console.log(category);
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <Link
          href="/dashboard/categories"
          className="text-secondaryColor hover:underline mb-4 inline-block"
        >
          <span className="text-primaryColor">&larr;</span> Back to Categories
        </Link>
        <Link
          href={`/dashboard/categories/${category.categoryId}/edit`}
          className="text-secondaryColor hover:underline mb-4 inline-block"
        >
          Edit
        </Link>
      </div>

      <div className="relative rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
        <div className="relative">
          <Image
            src={category.imageUrl}
            alt={`${category.categoryName}`}
            width={4000}
            height={2380}
            className="w-full h-96 object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

          <div className="absolute inset-x-0 -bottom-20 p-4 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {category.categoryName}
            </h2>

            <p className="text-lg font-semibold text-secondaryColor">
              Ksh. {category.price}/day
            </p>
          </div>
        </div>
        <div className="p-6 mt-20">
          <p className="text-gray-700 mb-6">{category.description}</p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Brands</h3>
            <div className="flex flex-wrap gap-2">
              {category.brands.map((brand, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  {brand.brandName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplay;
