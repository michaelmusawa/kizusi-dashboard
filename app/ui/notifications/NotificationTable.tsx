"use client";

import React, { useActionState, useState } from "react";
import BookingDetails from "../Bookings/BookingDetails";
import Link from "next/link";
import toast from "react-hot-toast";
import { updateBooking } from "@/app/lib/action";
import { BookingActionState } from "@/app/lib/definitions";
import {
  formatCurrency,
  formatDateToLocal,
  getStatusClass,
  toSentenceCase,
  truncateByWords,
} from "@/app/lib/utils";

const NotificationTable = ({ bookings }: { bookings: any }) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const initialState: BookingActionState = {
    message: null,
    errors: {},
    state_error: null,
  };

  const updateBookingWithId = updateBooking.bind(
    null,
    selectedBooking?.id ?? ""
  );
  const [state, formAction] = useActionState(updateBookingWithId, initialState);

  const handleViewToggle = (bookingId: string) => {
    if (selectedBooking?.id === bookingId && showDetails) {
      setShowDetails(false);
    } else {
      const booking = bookings.find((booking) => booking.id === bookingId);
      setSelectedBooking(booking);
      setShowDetails(true);
    }
  };

  if (state.message) {
    if (state.errors) {
      toast.error(state.message, {
        id: "error",
      });
    }
  } else if (state.state_error) {
    toast.error(state.state_error, { id: "state_error" });
  }

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
                <td className="border px-4 py-2">{booking.phone}</td>
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
                  {toSentenceCase(booking.paymentStatus)}
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
                  <form action={formAction}>
                    <input type="hidden" name="viewed" defaultValue="true" />
                    <button
                      type="submit"
                      onClick={() => handleViewToggle(booking.id)}
                      className="bg-secondaryColor hover:bg-cyan-600 text-white px-3 py-1 rounded-lg"
                    >
                      {showDetails && selectedBooking.id === booking.id
                        ? "Hide"
                        : "View"}
                    </button>
                  </form>
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
