import { getCategoryById } from "@/app/lib/action";
import CategoryDisplay from "@/app/ui/category/CategoryDisplay";

const Page = async (props: {
  params?: Promise<{
    id?: number;
  }>;
}) => {
  const params = await props.params;
  const id = params?.id || 0;

  const category = await getCategoryById(id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <CategoryDisplay category={category} />
      </div>
    </div>
  );
};

export default Page;
