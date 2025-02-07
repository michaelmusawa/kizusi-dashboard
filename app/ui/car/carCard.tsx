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
}) => {
  return (
    <div className="relative p-4 rounded-2xl shadow-lg">
      <div className="absolute top-2 right-2"></div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm">{category.categoryName}</span>
      </div>
      <Image
        src={
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={`${name} ${brand}`}
        width={2070}
        height={1380}
        className="w-full h-32 object-contain mb-4"
      />
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm">{description}</p>
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="flex items-center">
          <i className="icon-suv" />
          {brand.brandName}
        </span>
        {features &&
          features.map((feature, index) => (
            <span key={index}>
              {feature.featureValue} {feature.featureName}
            </span>
          ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Ksh.{price}/day</span>
      </div>
    </div>
  );
};

const CategoryCard: FC<CategoryState> = ({ name, price, image, brands }) => {
  return (
    <div className="relative p-4 rounded-2xl shadow-lg">
      <div className="absolute top-2 right-2"></div>
      <div className="flex items-center justify-between mb-4"></div>
      <Image
        src={
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={`${name}`}
        width={2070}
        height={1380}
        className="w-full h-32 object-contain mb-4"
      />
      <h2 className="text-lg font-bold">{name}</h2>
      <p className="text-sm mb-4">
        {brands.map((brand, index) => (
          <span key={index}>{brand.brandName},</span>
        ))}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">${price}/day</span>
      </div>
    </div>
  );
};

export { CarCard, CategoryCard };
