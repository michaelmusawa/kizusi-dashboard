import { getBookingById, getCarById } from "@/app/lib/action";
import BookingDetails from "@/app/ui/Bookings/BookingDetails";
import SuccessMessage from "@/app/ui/messageModal";
import Image from "next/image";

const Page = async (props: {
  searchParams?: Promise<{
    success?: boolean;
  }>;
  params?: Promise<{
    id?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const id = params?.id || "";
  const success = searchParams?.success;

  const booking = await getBookingById(id);
  let car;

  if (booking) {
    car = await getCarById(booking?.carId);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-3 md:p-6">
        <div aria-live="polite" aria-atomic="true">
          {success && <SuccessMessage message="Status updated successfully." />}
        </div>
        <BookingDetails booking={booking} />

        <div className="flex w-full border-t border-gray-300 mb-8"></div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* User Information Section */}
          <div className="flex-1 p-4 relative rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
            <div className="flex items-center gap-6">
              <div>
                <Image
                  src={booking?.userImage ?? "/images/profile.png"}
                  alt="User"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-300 bg-secondaryColor"
                />
              </div>
              <div className="flex">
                <div className="space-y-3">
                  <p className="text-xs md:text-lg text-gray-700">
                    <span className="font-semibold">Name:</span>{" "}
                    {booking?.userName}
                  </p>
                  <p className="text-xs md:text-lg text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {booking?.userEmail}
                  </p>
                  <p className="text-xs md:text-lg text-gray-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    {booking?.userPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Car Information Section */}
          {car && (
            <div className="flex-1 relative rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out">
              <div className="relative">
                <Image
                  src={car?.image}
                  alt={`${car.name} ${car.brand.brandName}`}
                  width={4000}
                  height={2380}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />

                <div className="absolute inset-x-0 -bottom-20 p-4 flex flex-col items-center text-center">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                    {car.name}
                  </h2>
                  <div className="bg-white/40 mt-2 mb-2 text-sm font-semibold text-gray-800 px-3 py-1 rounded-full inline-block">
                    {car.brand.brandName}
                  </div>
                  <p className="text-md md:text-lg font-semibold text-secondaryColor">
                    Ksh. {car.price}/day
                  </p>
                </div>
              </div>
              <div className="p-6 mt-12">
                <p className="text-xs md:text-lg text-gray-700 mb-6 line-clamp-2">
                  {car.description}
                </p>
                <div>
                  <div className="flex flex-wrap gap-2 border-t border-gray-300 p-2">
                    {booking?.addons.map((addon, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {addon?.addonName
                          ? addon.addonName
                          : "No addons selected"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
