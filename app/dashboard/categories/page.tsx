import { fetchCategoryPages } from "@/app/lib/action";
import CarDisplaySkeleton from "@/app/ui/car/CarDisplaySkeleton";
import CategoryDisplay from "@/app/ui/category/CategoryDisplay";
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
  const totalPages = await fetchCategoryPages(query);

  return (
    <main className="min-h-full p-6 bg-gray-100 relative">
      <div className="bg-white shadow-md rounded-lg p-4">
        {success && <SuccessMessage message="Category edited successfully." />}

        <div className="flex justify-between items-center mb-6 gap-4">
          <Link href={"/dashboard/categories/create"} className="block">
            <button className="border border-gray-300 shadow-lg p-2">
              Add
            </button>
          </Link>

          <Search placeholder="Search category name..." />
        </div>

        <Suspense key={query + currentPage} fallback={<CarDisplaySkeleton />}>
          <CategoryDisplay query={query} currentPage={currentPage} />
        </Suspense>

        <div className="absolute bottom-0 flex w-full  justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
};
export default Page;
