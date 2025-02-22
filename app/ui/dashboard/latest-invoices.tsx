import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/fonts/fonts";
import ArrowPathIcon from "../icons/ArrowPath";
import { fetchLatestBookings } from "@/app/lib/action";
export default async function LatestBookings({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const latestBookings = await fetchLatestBookings(startDate, endDate);

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Bookings
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestBookings.map((booking, i) => {
            return (
              <div
                key={booking.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={booking.imageUrl}
                    alt={`${booking.carName}'s profile picture`}
                    className="mr-4 rounded-2xl w-20 h-12"
                    width={5000}
                    height={4000}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {booking.carName}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {booking.categoryName}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {booking.userName}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {booking.email}
                  </p>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {booking.amount}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
