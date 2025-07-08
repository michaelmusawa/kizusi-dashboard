import { fetchCarPages } from "@/app/lib/action";
import CarsDisplay from "@/app/ui/car/CarsDisplay";
import CarDisplaySkeleton from "@/app/ui/car/CarDisplaySkeleton";
import SuccessMessage from "@/app/ui/messageModal";
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import Link from "next/link";
import { Suspense } from "react";
import AI from "@/app/ui/AI";

const Page = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    success?: boolean;
    deleted?: boolean;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const success = searchParams?.success;
  const deleted = searchParams?.deleted;
  const totalPages = await fetchCarPages(query);
  return (
    <main className="min-h-full bg-gray-100 p-3 lg:p-6 relative">
      <div className="bg-white shadow-md rounded-lg px-4 pt-4 pb-14 min-h-full">
        <div aria-live="polite" aria-atomic="true">
          {success && <SuccessMessage message="Car updated successfully." />}
          {deleted && (
            <SuccessMessage
              deleted={true}
              message="Car deleted successfully."
            />
          )}
        </div>
        <div className="flex justify-between items-center mb-6 gap-4">
          <Link href="/dashboard/cars/create">
            <button className="bg-secondaryColor rounded-lg shadow-lg p-2 text-gray-50">
              Add car
            </button>
          </Link>
          <Search placeholder="Search car name, category or brand..." />
        </div>

        <Suspense key={query + currentPage} fallback={<CarDisplaySkeleton />}>
          <CarsDisplay query={query} currentPage={currentPage} />
        </Suspense>
      </div>
      <div className="absolute bottom-8 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
};
export default Page;
