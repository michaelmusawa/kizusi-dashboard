import { getCategoryById } from "@/app/lib/action";
import EditCategory from "./_edit";

type Params = { id: string };

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const category = await getCategoryById(id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <EditCategory category={category} id={id} />
      </div>
    </div>
  );
};

export default Page;
