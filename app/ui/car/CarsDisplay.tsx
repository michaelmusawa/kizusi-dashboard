import { fetchFilteredCars } from "@/app/lib/action";
import Link from "next/link";
import React from "react";
import { CarCard } from "./carCard";

const CarsDisplay = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const cars = await fetchFilteredCars(query, currentPage);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cars.map((car) => (
        <Link key={car.id} href={`/dashboard/cars/${car.id}/display`}>
          <CarCard key={car.id} {...car} />
        </Link>
      ))}
    </div>
  );
};

export default CarsDisplay;
