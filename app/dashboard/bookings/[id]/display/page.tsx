import { getBookingById } from "@/app/lib/action";

type Params = { id: string };

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const booking = await getBookingById(id);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {booking?.userName}
        {booking?.amount}
        {booking?.bookingStatus}
      </div>
    </div>
  );
};

export default Page;
