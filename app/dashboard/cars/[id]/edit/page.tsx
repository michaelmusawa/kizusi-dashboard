import { fetchFilteredCategories, getCarById } from "@/app/lib/action";
import EditCar from "./_edit";

const Page = async (props: {
  params?: Promise<{
    id?: number;
  }>;
}) => {
  const params = await props.params;
  const id = params?.id || 0;

  const car = await getCarById(id);
  const categories = await fetchFilteredCategories("", 1);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <EditCar car={car} id={id} categories={categories} />
      </div>
    </div>
  );
};

export default Page;
