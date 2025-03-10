import React from "react";

const CarDisplaySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="relative rounded-2xl shadow-md overflow-hidden animate-pulse bg-gray-200"
        >
          <div className="absolute top-4 right-4 z-10 bg-gray-300 h-6 w-20 rounded-full" />
          <div className="h-80 bg-gray-300 w-full" />
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="mt-4 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-full" />
              <div className="h-5 bg-gray-300 rounded w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarDisplaySkeleton;
