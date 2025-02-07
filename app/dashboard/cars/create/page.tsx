import { fetchFilteredCategories } from "@/app/lib/action";
import CreateCar from "./_create";

const Page = async () => {
  const categories = await fetchFilteredCategories("", 1);

  return <CreateCar categories={categories} />;
};

export default Page;
