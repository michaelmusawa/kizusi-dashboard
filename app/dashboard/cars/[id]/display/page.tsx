import { getCarById } from "@/app/lib/action";
import CarDisplay from "@/app/ui/car/carDisplay";

const Page = async (props: {
  params?: Promise<{
    id?: number;
  }>;
}) => {
  const params = await props.params;
  const id = params?.id || 0;

  const car = await getCarById(id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <CarDisplay car={car} />
      </div>
    </div>
  );
};

export default Page;
