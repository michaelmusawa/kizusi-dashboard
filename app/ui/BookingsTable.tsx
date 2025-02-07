import React from "react";
import { fetchFilteredBookings } from "../lib/action";
import Link from "next/link";

const BookingsTable = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const bookings = await fetchFilteredBookings(query, currentPage);

  console.log(bookings);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-purple-500 bg-purple-100";
      case "CANCELLED":
        return "text-orange-500 bg-orange-100";
      default:
        return "";
    }
  };

  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-4 border-b font-medium">No.</th>

            <th className="p-4 border-b font-medium">Customer Name</th>
            <th className="p-4 border-b font-medium">Phone</th>
            <th className="p-4 border-b font-medium">Car</th>
            <th className="p-4 border-b font-medium">Book Type</th>
            <th className="p-4 border-b font-medium">Pick-up</th>
            <th className="p-4 border-b font-medium">Drop-off</th>
            <th className="p-4 border-b font-medium">Date & Time</th>
            <th className="p-4 border-b font-medium">amount</th>
            <th className="p-4 border-b font-medium">Payment Status</th>
            <th className="p-4 border-b font-medium">Payment Type</th>
            <th className="p-4 border-b font-medium">Status</th>
            <th className="p-4 border-b font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{index + 1}</td>
              <td className="p-4 border-b">{booking.userName}</td>
              <td className="p-4 border-b">{booking.phone}</td>
              <td className="p-4 border-b">{booking.carName}</td>
              <td className="p-4 border-b">{booking.bookType}</td>
              <td className="p-4 border-b">{booking.departure}</td>
              <td className="p-4 border-b">{booking.destination}</td>
              <td className="p-4 border-b">{booking.createdAt.toString()}</td>
              <td className="p-4 border-b">{booking.amount}</td>
              <td className="p-4 border-b">{booking.paymentStatus}</td>
              <td className="p-4 border-b">{booking.paymentType}</td>
              <td className="p-4 border-b">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                    booking.bookingStatus
                  )}`}
                >
                  {booking.bookingStatus}
                </span>
              </td>
              <td className="p-4 border-b">
                <Link href={`/dashboard/bookings/${booking.id}/display`}>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
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
