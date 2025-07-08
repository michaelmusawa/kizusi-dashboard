import { getTransactionsById } from "@/app/lib/action";

const Page = async (props: { params?: Promise<{ id?: string }> }) => {
  const params = await props.params;
  const id = params?.id || "";

  const transactions = await getTransactionsById(id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {transactions?.reference}
        {transactions?.amount}
        {transactions?.status}
      </div>
    </div>
  );
};

export default Page;
