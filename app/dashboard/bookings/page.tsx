import { fetchBookingsPages } from "@/app/lib/action";
import BookingsTable from "@/app/ui/BookingsTable";
import CarDisplaySkeleton from "@/app/ui/car/CarDisplaySkeleton";
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import React, { Suspense } from "react";

const Page = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    success?: boolean;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchBookingsPages(query);

  return (
    <main className="min-h-full bg-gray-100 p-6 relative">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center mb-6">
          <Search placeholder="Search here..." />
        </div>

        <Suspense key={query + currentPage} fallback={<CarDisplaySkeleton />}>
          <BookingsTable query={query} currentPage={currentPage} />
        </Suspense>

        <div className="absolute bottom-0 flex w-full  justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
};

export default Page;
