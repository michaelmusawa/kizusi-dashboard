import { FC } from "react";
import Image from "next/image";
import { CarState, CategoryState } from "@/app/lib/definitions";

const CarCard: FC<CarState> = ({
  name,
  brand,
  image,
  category,
  description,
  features,
  price,
  addons,
}) => {
  return (
    <div className="relative rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
      <div className="absolute top-4 right-4 z-10 bg-[rgba(88,184,201,0.6)] backdrop-blur-sm text-xs font-semibold text-gray-100 px-3 py-1 rounded-full">
        {category.categoryName}
      </div>

      <div className="relative">
        <Image
          src={image}
          alt={`${name} ${brand.brandName}`}
          width={2070}
          height={1380}
          className="w-full h-80 object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-x-0 -bottom-12 p-4 flex flex-col items-center text-center">
          <h5 className="text-lg font-bold text-gray-800">{name}</h5>
          <div className="bg-white/40 mt-2 mb-2 text-xs font-semibold text-gray-800 px-3 py-1 rounded-full inline-block">
            {brand.brandName}
          </div>
          <p className="text-sm font-semibold text-secondaryColor">
            Ksh. {price}/day
          </p>
        </div>
      </div>

      <div className="p-4 mt-8">
        <p className="text-sm text-gray-600 line-clamp-3 min-h-[4rem]">
          {description}
        </p>

        <div className="mt-4 space-y-2">
          {features && features.length > 0 ? (
            <div className="flex items-center gap-2 border-t border-gray-200 pt-2 overflow-hidden whitespace-nowrap min-h-[1.5rem]">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  {feature.featureValue} {feature.featureName}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 border-t border-gray-200 pt-2 overflow-hidden whitespace-nowrap min-h-[1.5rem]">
              <span className="text-xs text-gray-700 px-2 py-1 rounded-full">
                No features
              </span>
            </div>
          )}
          {addons && addons.length > 0 ? (
            <div className="flex items-center gap-2 border-t border-gray-200 pt-2 overflow-hidden whitespace-nowrap min-h-[1.5rem]">
              {addons.map((addon, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  {addon.addonName}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 border-t border-gray-200 pt-2 overflow-hidden whitespace-nowrap min-h-[1.5rem]">
              <span className="text-xs text-gray-700 px-2 py-1 rounded-full">
                No addons
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryCard: FC<CategoryState> = ({
  categoryName,
  price,
  imageUrl,
  brands,
  description,
}) => {
  return (
    <div className="relative rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={`${categoryName}`}
          width={2070}
          height={1380}
          className="w-full h-80 object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-x-0 -bottom-12 p-4 flex flex-col items-center text-center">
          <h5 className="text-lg font-bold text-gray-800">{categoryName}</h5>

          <p className="text-sm font-semibold text-secondaryColor">
            Ksh. {price}/day
          </p>
        </div>
      </div>

      <div className="p-4 mt-8">
        <p className="text-sm text-gray-600 line-clamp-3 min-h-[4rem]">
          {description}
        </p>
      </div>

      <div className="space-y-2">
        {brands ? (
          <div className="flex items-center gap-2 border-t border-gray-200 px-2 py-4 overflow-hidden whitespace-nowrap min-h-[1.5rem]">
            {brands.map((brand, index) => (
              <span
                key={index}
                className="px-2 text-xs bg-gray-100 border border-gray-200 rounded-2xl"
              >
                {brand.brandName}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-gray-200 pt-2 overflow-hidden whitespace-nowrap min-h-[1.5rem]">
            <span className="text-xs text-gray-700 px-2 py-1 rounded-full">
              No brands
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { CarCard, CategoryCard };
