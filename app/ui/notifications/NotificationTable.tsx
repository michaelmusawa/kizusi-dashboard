"use client";

import React, { useState } from "react";
import BookingDetails from "../Bookings/BookingDetails";
import Link from "next/link";

const NotificationTable = ({ bookings }: { bookings: any }) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewToggle = async (bookingId: string) => {
    if (selectedBooking?.id === bookingId && showDetails) {
      setShowDetails(false);
    } else {
      const booking = bookings.find((booking) => booking.id === bookingId);
      setSelectedBooking(booking);
      setShowDetails(true);
    }
  };
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
    <div className="mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {/* Booking Details Preview */}
      {showDetails && selectedBooking && (
        <div className="mb-8">
          <BookingDetails booking={selectedBooking} />
          <Link href={`/dashboard/bookings/${selectedBooking.id}/display`}>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              View booking
            </button>
          </Link>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-scroll">
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
                <td className="p-4 border-b">
                  {booking.bookingDate.toString()}
                </td>
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
                  <button
                    onClick={() => handleViewToggle(booking.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                  >
                    {showDetails && selectedBooking.id === booking.id
                      ? "Hide"
                      : "View"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationTable;
