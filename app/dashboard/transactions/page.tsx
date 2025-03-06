import { fetchTransactionsPages } from "@/app/lib/action";
import CarDisplaySkeleton from "@/app/ui/car/CarDisplaySkeleton";
import DateRangeFilter from "@/app/ui/dateRangeFilter";
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import TransactionsTable from "@/app/ui/TransactionsTable";
import Link from "next/link";
import React, { Suspense } from "react";

const Page = async (props: {
  searchParams?: Promise<{
    query?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    success?: boolean;
    source?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTransactionsPages(query);

  return (
    <main className="min-h-full bg-gray-100 p-6 relative">
      <div className="bg-white shadow-md rounded-lg p-4">
        {searchParams?.source && (
          <Link
            href={`/dashboard/bookings/${query}/display`}
            className="text-secondaryColor hover:underline mb-4 inline-block"
          >
            <span className="text-primaryColor">&larr;</span> Back to booking
            details
          </Link>
        )}

        <div className="flex justify-between items-center mb-6">
          <Search placeholder="Search here..." />
          <DateRangeFilter
            placeholderStart="Start Date"
            placeholderEnd="End Date"
          />
        </div>

        <Suspense key={query + currentPage} fallback={<CarDisplaySkeleton />}>
          <TransactionsTable
            query={query}
            startDate={startDate}
            endDate={endDate}
            currentPage={currentPage}
          />
        </Suspense>

        <div className="absolute bottom-0 flex w-full  justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
};

export default Page;
