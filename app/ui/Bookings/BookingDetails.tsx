"use client";

import React, { useActionState, useState } from "react";
import { BookingActionState, BookingState } from "@/app/lib/definitions";
import toast from "react-hot-toast";
import { updateBooking } from "@/app/lib/action";
import Link from "next/link";
import {
  calculateDaysBetween,
  formatCurrency,
  formatDateToLocal,
  formatTimeToLocal,
  getStatusClass,
} from "@/app/lib/utils";
import ArrowRightIcon from "../icons/arrowRight";
import MapWithMarkers from "./Geoapify";

const BookingDetails = ({
  booking,
  actionButtons = true,
}: {
  booking: BookingState | null;
  actionButtons?: boolean;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const initialState: BookingActionState = {
    message: null,
    errors: {},
    state_error: null,
  };

  const updateBookingWithId = updateBooking.bind(null, booking?.id ?? "");
  const [state, formAction, isPending] = useActionState(
    updateBookingWithId,
    initialState
  );
  const [modalAction, setModalAction] = useState<{
    field: string;
    value: string;
  } | null>(null);

  if (state.message) {
    if (state.errors) {
      toast.error(state.message, {
        id: "error",
      });
    }
  } else if (state.state_error) {
    toast.error(state.state_error, { id: "state_error" });
  }

  const handleOnClick = (field: string, value: string) => {
    setModalAction({ field, value });
    setIsModalVisible(true);
  };

  function SubmitButton() {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isPending) {
        e.preventDefault();
      }
    };

    return (
      <button
        type="submit"
        disabled={isPending}
        onClick={handleClick}
        className="flex items-center justify-center gap-2 mt-4 border border-gray-300 rounded-lg p-2 bg-secondaryColor text-white w-full hover:bg-cyan-600"
      >
        {isPending ? "Updating..." : "Yes"}
        {isPending ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        ) : (
          <ArrowRightIcon className="w-4" />
        )}
      </button>
    );
  }

  let numberOfDays = 0;
  if (booking?.bookingDate && booking.bookingEndDate) {
    numberOfDays = calculateDaysBetween(
      booking?.bookingDate,
      booking.bookingEndDate
    );
  } else if (booking?.bookingDate) {
    numberOfDays = 1;
  }

  return (
    <div className="container mx-auto p-4">
      {actionButtons && (
        <div className="flex justify-between mb-6">
          <Link
            href="/dashboard/bookings"
            className="text-xs md:text-lg text-secondaryColor hover:underline mb-4 inline-block"
          >
            <span className="text-primaryColor">&larr;</span> Back to bookings
          </Link>
          <Link
            href={`/dashboard/transactions?query=${booking?.id}&&source=booking_details`}
            className="text-xs md:text-lg text-secondaryColor hover:underline mb-4 inline-block"
          >
            View transactions
          </Link>
        </div>
      )}

      {/* Booking Details Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Booking Type:</span>{" "}
            {booking?.bookType === "full_day" ? "Full day" : "Transfer"}
          </p>
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Departure:</span>{" "}
            {booking?.departure}
          </p>
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Date:</span>{" "}
            {booking?.bookingDate &&
              formatDateToLocal(booking.bookingDate.toString()) +
                " " +
                formatTimeToLocal(booking.bookingDate.toString())}
          </p>
          {booking?.bookType === "full_day" && (
            <>
              <p className="text-xs md:text-lg">
                <span className="font-semibold text-gray-700">To:</span>{" "}
                {booking?.bookingEndDate &&
                  formatDateToLocal(booking.bookingEndDate.toString()) +
                    " " +
                    formatTimeToLocal(booking.bookingEndDate.toString())}
              </p>
              <p className="text-xs md:text-lg">
                <span className="font-semibold text-gray-700">
                  No. of days:{" "}
                </span>{" "}
                {`${numberOfDays} ${numberOfDays === 1 ? "day" : "days"}`}
              </p>
            </>
          )}
          {booking?.bookType === "transfer" && (
            <p className="text-lg">
              <span className="font-semibold text-gray-700">Destination:</span>{" "}
              {booking?.destination}
            </p>
          )}
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Payment Type:</span>{" "}
            {booking?.paymentType === "full" ? "Full amount" : "Reserved"}
          </p>
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Payment Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                booking?.paymentStatus ?? ""
              )}`}
            >
              {booking?.paymentStatus}
            </span>
          </p>
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Booking Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                booking?.bookingStatus ?? ""
              )}`}
            >
              {booking?.bookingStatus}
            </span>
          </p>
          <p className="text-xs md:text-lg">
            <span className="font-semibold text-gray-700">Amount:</span>{" "}
            {formatCurrency(booking?.amount ?? 0)}
          </p>
        </div>

        {/* Map Section */}
        {booking && (
          <div className="rounded-xl overflow-hidden shadow-lg">
            <MapWithMarkers
              departureLongitude={
                booking.departureLongitude
                  ? parseFloat(booking.departureLongitude)
                  : 0
              }
              departureLatitude={
                booking.departureLatitude
                  ? parseFloat(booking.departureLatitude)
                  : 0
              }
              destinationLongitude={
                booking.destinationLongitude
                  ? parseFloat(booking.destinationLongitude)
                  : null
              }
              destinationLatitude={
                booking.destinationLatitude
                  ? parseFloat(booking.destinationLatitude)
                  : null
              }
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}

      {actionButtons && (
        <div className="flex flex-wrap gap-4 mt-8">
          {booking?.bookingStatus === "PENDING" &&
          booking.paymentStatus === "CONFIRMED" ? (
            <>
              <button
                onClick={() => handleOnClick("bookingStatus", "PROCEEDED")}
                className="text-xs md:text-lg px-6 py-2 bg-secondaryColor text-white rounded-lg hover:bg-cyan-600 transition"
              >
                Proceeded
              </button>
              <button
                onClick={() => handleOnClick("bookingStatus", "NO SHOW")}
                className="text-xs md:text-lg px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                No Show
              </button>
            </>
          ) : (
            booking?.bookingStatus === "CANCELLED" && (
              <button
                onClick={() => handleOnClick("bookingStatus", "REFUNDED")}
                className="text-xs md:text-lg px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Mark as Refunded
              </button>
            )
          )}

          {booking?.paymentStatus === "PENDING" && (
            <>
              <button
                onClick={() => handleOnClick("paymentStatus", "CONFIRMED")}
                className="text-xs md:text-lg px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => handleOnClick("deleteStatus", "DELETED")}
                className="text-xs md:text-lg px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete booking
              </button>
            </>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalVisible && modalAction && (
        <div className="fixed h-full w-full inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Confirm Update</h2>
            <p className="text-lg mb-6">
              Are you sure you want to update the{" "}
              {modalAction.field
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .toLowerCase()}{" "}
              to <span className="font-semibold">{modalAction.value}</span>?
            </p>

            <div className="flex gap-4">
              <form action={formAction} className="flex-1">
                <input type="hidden" name="viewed" defaultValue="true" />
                <input
                  type="hidden"
                  name={modalAction.field}
                  defaultValue={modalAction.value}
                />
                <SubmitButton />
              </form>
              <button
                onClick={() => setIsModalVisible(false)}
                className="flex-1 items-center justify-center gap-2 mt-4 border border-gray-300 rounded-lg p-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
