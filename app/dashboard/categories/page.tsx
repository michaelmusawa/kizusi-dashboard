import { fetchCategoryPages } from "@/app/lib/action";
import CarDisplaySkeleton from "@/app/ui/car/CarDisplaySkeleton";
import CategoriesDisplay from "@/app/ui/category/CategoriesDisplay";
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
      <div className="bg-white shadow-md rounded-lg px-4 pt-4 pb-14 min-h-full">
        <div aria-live="polite" aria-atomic="true">
          {success && (
            <SuccessMessage message="Category edited successfully." />
          )}
        </div>
        <div className="flex justify-between items-center mb-6 gap-4">
          <Link href={"/dashboard/categories/create"} className="block">
            <button className="bg-secondaryColor rounded-lg shadow-lg p-2 text-gray-50">
              Add category
            </button>
          </Link>

          <Search placeholder="Search category name..." />
        </div>

        <Suspense key={query + currentPage} fallback={<CarDisplaySkeleton />}>
          <CategoriesDisplay query={query} currentPage={currentPage} />
        </Suspense>

        <div className="absolute bottom-8 flex w-full  justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
};
export default Page;
