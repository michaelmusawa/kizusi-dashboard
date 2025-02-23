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
    <div className="relative rounded-2xl shadow-lg">
      <div className="absolute top-2 right-2 py-1 px-2 bg-gray-100 border border-gray-200 rounded-2xl">
        {category.categoryName}
      </div>
      <div className="absolute top-2 left-2 py-1 px-2 bg-gray-100 border border-gray-200 rounded-2xl">
        {brand.brandName}
      </div>
      <Image
        src={image}
        alt={`${name} ${brand}`}
        width={2070}
        height={1380}
        className="w-full h-56 rounded-2xl"
      />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between">
          <h5 className="text-gray-700 font-semibold">{name}</h5>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Ksh.{price}/day</span>
          </div>
        </div>

        <p className="text-sm">{description}</p>
        <div className="flex flex-col text-sm">
          <p className="flex gap-2 border-t border-gray-300 py-2">
            Features:
            {features &&
              features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 bg-gray-100 border border-gray-200 rounded-2xl"
                >
                  {feature.featureValue} {feature.featureName}
                </span>
              ))}
          </p>
          <p className="flex gap-2 border-t border-gray-300 py-2">
            Addons:
            {addons &&
              addons.map((addon, index) => (
                <span
                  key={index}
                  className="px-2 bg-gray-100 border border-gray-200 rounded-2xl"
                >
                  {addon.addonName}
                </span>
              ))}
          </p>
        </div>
      </div>
    </div>
  );
};

const CategoryCard: FC<CategoryState> = ({
  name,
  price,
  image,
  brands,
  description,
}) => {
  return (
    <div className="relative rounded-2xl shadow-lg">
      <div className="w-full h-56 overflow-hidden">
        <Image
          src={image}
          alt={`${name}`}
          width={2070}
          height={1380}
          className="w-full h-auto mb-4 rounded-2xl"
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between">
          <h5 className="text-gray-700 font-semibold">{name}</h5>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Ksh.{price}/day</span>
          </div>
        </div>

        <p className="text-sm">{description}</p>
        <div className="flex flex-col text-sm">
          <p className="flex gap-2 border-t border-gray-300 py-2 flex-wrap">
            Brands:
            {brands &&
              brands.map((brand, index) => (
                <span
                  key={index}
                  className="px-2 bg-gray-100 border border-gray-200 rounded-2xl"
                >
                  {brand.brandName}
                </span>
              ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export { CarCard, CategoryCard };
