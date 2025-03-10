import React from "react";
import { fetchFilteredBookings } from "../lib/action";
import Link from "next/link";
import {
  formatCurrency,
  formatDateToLocal,
  getStatusClass,
  toSentenceCase,
  truncateByWords,
} from "../lib/utils";

const BookingsTable = async ({
  query,
  startDate,
  endDate,
  currentPage,
}: {
  query: string;
  startDate: string;
  endDate: string;
  currentPage: number;
}) => {
  const bookings = await fetchFilteredBookings(
    query,
    startDate,
    endDate,
    currentPage,
    ""
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 mx-auto">
        <thead className="bg-[rgba(88,184,201,0.2)] text-secondaryColor max-lg:text-sm max-sm:text-xs">
          <tr>
            <th className="border px-4 py-2">No.</th>

            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Car</th>
            <th className="border px-4 py-2">Book Type</th>
            <th className="border px-4 py-2">Pick-up</th>
            <th className="border px-4 py-2">Drop-off</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Payment Status</th>
            <th className="border px-4 py-2">Payment Type</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr
              key={index}
              className="max-lg:text-sm max-sm:text-xs hover:bg-gray-50 text-gray-700 font-medium"
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{booking.userName}</td>
              <td className="border px-4 py-2">{booking.userPhone}</td>
              <td className="border px-4 py-2">{booking.carName}</td>
              <td className="border px-4 py-2">
                {booking.bookType === "full_day" ? "Full day" : "Transfer"}
              </td>
              <td className="border px-4 py-2">
                {truncateByWords(booking.departure)}
              </td>
              <td className="border px-4 py-2">
                {truncateByWords(booking.destination)}
              </td>
              <td className="border px-4 py-2">
                {formatDateToLocal(booking.bookingDate.toString())}
              </td>
              <td className="border px-4 py-2">
                {formatCurrency(booking.amount)}
              </td>
              <td className="border px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                    booking.paymentStatus
                  )}`}
                >
                  {toSentenceCase(booking.paymentStatus)}
                </span>
              </td>
              <td className="border px-4 py-2">
                {booking.paymentType === "full" ? "Full amount" : "Reserved"}
              </td>
              <td className="border px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus}
                </span>
              </td>
              <td className="border px-4 py-2">
                <Link href={`/dashboard/bookings/${booking.id}/display`}>
                  <button className="bg-secondaryColor text-white px-3 py-1 rounded-lg">
                    Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
