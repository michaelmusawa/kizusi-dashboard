import CardWrapper from "@/app/ui/dashboard/cards";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import { Suspense } from "react";
import {
  CardsSkeleton,
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/app/ui/skeletons";
import { lusitana } from "@/app/fonts/fonts";
import LatestBookings from "@/app/ui/dashboard/latest-invoices";
import DateRangeFilter from "@/app/ui/dateRangeFilter";

export default async function Page(props: {
  searchParams?: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const startDate = searchParams?.startDate || "";
  const endDate = searchParams?.endDate || "";

  return (
    <main>
      <div
        className={`flex justify-between items-center bg-gradient-to-r from-secondaryColor to-primaryColor p-3 rounded-lg shadow-md mb-4`}
      >
        <h1 className={`${lusitana.className} text-2xl font-bold text-white`}>
          Dashboard
        </h1>
        <DateRangeFilter
          placeholderStart="Start Date"
          placeholderEnd="End Date"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper startDate={startDate} endDate={endDate} />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart startDate={startDate} endDate={endDate} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestBookings startDate={startDate} endDate={endDate} />
        </Suspense>
      </div>
    </main>
  );
}
