import { fetchCarPages } from "@/app/lib/action";
import CarDisplay from "@/app/ui/car/CarDisplay";
import CarDisplaySkeleton from "@/app/ui/car/CarDisplaySkeleton";
import SuccessMessage from "@/app/ui/messageModal";
import Pagination from "@/app/ui/pagination";
import Search from "@/app/ui/search";
import Link from "next/link";
import { Suspense } from "react";

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
  const success = searchParams?.success;
  const totalPages = await fetchCarPages(query);
  return (
    <main className="min-h-full bg-gray-100 p-6 relative">
      <div className="bg-white shadow-md rounded-lg p-4 min-h-full">
        <div aria-live="polite" aria-atomic="true">
          {success && <SuccessMessage message="Car updated successfully." />}
        </div>
        <div className="flex justify-between items-center mb-6">
          <Link href={"/dashboard/cars/create"}>
            <button className="bg-blue-500 rounded-lg shadow-lg p-2 text-gray-50">
              Add
            </button>
          </Link>
          <Search placeholder="Search car name, category or brand..." />
          <button className="px-4 py-2 ml-4 rounded-lg">Filter</button>
        </div>

        <Suspense key={query + currentPage} fallback={<CarDisplaySkeleton />}>
          <CarDisplay query={query} currentPage={currentPage} />
        </Suspense>
      </div>
      <div className="absolute bottom-4 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
};
export default Page;
