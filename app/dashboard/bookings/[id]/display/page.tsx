import { getBookingById, getCarById } from "@/app/lib/action";
import BookingDetails from "@/app/ui/Bookings/BookingDetails";
import Image from "next/image";

type Params = { id: string };

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;

  const booking = await getBookingById(id);
  let car;

  if (booking) {
    car = await getCarById(booking?.carId);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>

      <BookingDetails booking={booking} />

      <div className="flex gap-4">
        {/* User Information Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Image
                src={booking?.user?.image ?? "/car.svg"}
                alt="User"
                width={100}
                height={100}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <div className="col-span-2">
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {booking?.userName}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {booking?.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {booking?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Car Information Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Car Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Image
                src={car?.image ?? "/car.svg"}
                alt={car?.name ?? "car image"}
                width={400}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="col-span-2">
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {car?.name}
                </p>
                <p>
                  <span className="font-medium">Brand:</span>{" "}
                  {car?.brand.brandName}
                </p>
                <p>
                  <span className="font-medium">Category:</span>{" "}
                  {car?.category.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {car?.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {feature.featureName}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {booking?.addons.map((addon, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {addon.addonName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
