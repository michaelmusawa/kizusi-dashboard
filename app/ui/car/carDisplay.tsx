import Image from "next/image";
import Link from "next/link";
import { CarState } from "@/app/lib/definitions";

const CarDisplay = ({ car }: { car: CarState }) => {
  return (
    <div className="container mx-auto p-2 lg:p-4">
      <div className="flex justify-between">
        <Link
          href="/dashboard/cars"
          className="text-secondaryColor hover:underline mb-4 inline-block"
        >
          <span className="text-primaryColor">&larr;</span> Back to Cars
        </Link>
        <Link
          href={`/dashboard/cars/${car.id}/edit`}
          className="text-secondaryColor hover:underline mb-4 inline-block"
        >
          Edit
        </Link>
      </div>

      <div className="relative rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
        <div className="absolute top-4 right-4 z-10 bg-[rgba(88,184,201,0.6)] backdrop-blur-sm text-lg font-semibold text-gray-100 px-3 py-1 rounded-full">
          {car.category.categoryName}
        </div>
        <div className="relative">
          <Image
            src={car.image}
            alt={`${car.name} ${car.brand.brandName}`}
            width={4000}
            height={2380}
            className="w-full h-96 object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

          <div className="absolute inset-x-0 -bottom-20 p-4 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-gray-800">{car.name}</h2>
            <div className="bg-white/40 mt-2 mb-2 text-sm font-semibold text-gray-800 px-3 py-1 rounded-full inline-block">
              {car.brand.brandName}
            </div>
            <p className="text-lg font-semibold text-secondaryColor">
              Ksh. {car.price}/day
            </p>
          </div>
        </div>
        <div className="p-6 mt-20">
          <p className="text-gray-700 mb-6">{car.description}</p>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  {feature.featureValue} {feature.featureName}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Addons</h3>
            <div className="flex flex-wrap gap-2">
              {car.addons.map((addon, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                >
                  {addon.addonName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDisplay;
