import { lusitana } from "@/app/fonts/fonts";
import { generateYAxis, groupBookingsByCategory } from "@/app/lib/utils";
import { fetchLatestBookings } from "@/app/lib/action";
import Calendar from "../icons/Calender";

export default async function RevenueChart({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const bookings = await fetchLatestBookings(startDate, endDate);
  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(bookings);

  if (!bookings || bookings.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  const groupedBookings = groupBookingsByCategory(bookings);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {groupedBookings.map((cat) => (
            <div
              key={cat.categoryName}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * cat.categoryTotal}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {cat.categoryName}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Highest 12 categories</h3>
        </div>
      </div>
    </div>
  );
}
