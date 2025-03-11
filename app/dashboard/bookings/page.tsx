import { fetchBookingsPages } from "@/app/lib/action";
import BookingsTableSkeleton from "@/app/ui/Bookings/TableSkeleton";
import BookingsTable from "@/app/ui/BookingsTable";
import DateRangeFilter from "@/app/ui/dateRangeFilter";
import SuccessMessage from "@/app/ui/messageModal";
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import React, { Suspense } from "react";

const Page = async (props: {
  searchParams?: Promise<{
    query?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    deleted?: boolean;
    success?: boolean;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";
  const currentPage = Number(searchParams?.page) || 1;
  const deleted = searchParams?.deleted;
  const totalPages = await fetchBookingsPages(query);

  return (
    <main className="min-h-full bg-gray-100 p-3 md:p-6 relative">
      <div className="bg-white shadow-md rounded-lg p-2 md:p-4">
        <div aria-live="polite" aria-atomic="true">
          {deleted && (
            <SuccessMessage
              deleted={true}
              message="Booking deleted successfully."
            />
          )}
        </div>
        <div className="flex justify-between items-center mb-6">
          <Search placeholder="Search here..." />
          <DateRangeFilter
            placeholderStart="Start Date"
            placeholderEnd="End Date"
          />
        </div>

        <Suspense
          key={query + currentPage}
          fallback={<BookingsTableSkeleton />}
        >
          <BookingsTable
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
