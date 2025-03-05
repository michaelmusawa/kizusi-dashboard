"use client";

import React, { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { BookingActionState, BookingState } from "@/app/lib/definitions";
import toast from "react-hot-toast";
import { updateBooking } from "@/app/lib/action";
import Link from "next/link";
import {
  formatCurrency,
  formatDateToLocal,
  formatTimeToLocal,
  getStatusClass,
} from "@/app/lib/utils";
import ArrowRightIcon from "../icons/arrowRight";

const BookingDetails = ({ booking }: { booking: BookingState }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const initialState: BookingActionState = {
    message: null,
    errors: {},
    state_error: null,
  };

  const updateBookingWithId = updateBooking.bind(null, booking.id);
  const [state, formAction, isPending] = useActionState(
    updateBookingWithId,
    initialState
  );
  const [modalAction, setModalAction] = useState<{
    field: string;
    value: string;
  } | null>(null);

  // Listen to state changes to show errors or messages.
  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast.error(state.message, { id: "error" });
      }
      setIsModalVisible(false);
    } else if (state.state_error) {
      setIsModalVisible(false);
      toast.error(state.state_error, { id: "state_error" });
    }
  }, [state]);

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <Link
          href="/dashboard/bookings"
          className="text-secondaryColor hover:underline mb-4 inline-block"
        >
          &larr; Back to bookings
        </Link>
        <Link
          href={`/dashboard/transactions?query=${booking.id}`}
          className="text-secondaryColor hover:underline mb-4 inline-block"
        >
          View transactions
        </Link>
      </div>
      {/* Booking Details Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Booking Type:</span>{" "}
            {booking.bookType === "full_day" ? "Full day" : "Transfer"}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Departure:</span>{" "}
            {booking.departure}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Date:</span>{" "}
            {formatDateToLocal(booking.bookingDate.toString())},{" "}
            {formatTimeToLocal(booking.bookingDate.toString())}
          </p>
          {booking.bookType === "transfer" && (
            <p className="text-lg">
              <span className="font-semibold text-gray-700">Destination:</span>{" "}
              {booking.destination}
            </p>
          )}
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Payment Type:</span>{" "}
            {booking.paymentType === "full" ? "Full amount" : "Reserved"}
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Payment Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                booking.paymentStatus
              )}`}
            >
              {booking.paymentStatus}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Booking Status:</span>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                booking.bookingStatus
              )}`}
            >
              {booking.bookingStatus}
            </span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Amount:</span>{" "}
            {formatCurrency(booking.amount)}
          </p>
        </div>

        {/* Map Section */}
        {booking && (
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${
                booking.destinationLongitude || booking.departureLongitude
              },${
                booking.destinationLatitude || booking.departureLatitude
              }&zoom=14&marker=lonlat:${booking.departureLongitude},${
                booking.departureLatitude
              }&icon=${encodeURIComponent(
                "https://api.geoapify.com/v1/icon/?icon=location-pin&color=%23FF0000&size=medium&type=awesome&apiKey=YOUR_API_KEY"
              )}${
                booking.destinationLongitude && booking.destinationLatitude
                  ? `&marker=lonlat:${booking.destinationLongitude},${
                      booking.destinationLatitude
                    }&icon=${encodeURIComponent(
                      `https://api.geoapify.com/v1/icon/?icon=location-pin&color=%2300FF00&size=medium&type=awesome&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
                    )}`
                  : ""
              }&path=lonlat:${booking.departureLongitude},${
                booking.departureLatitude
              }|lonlat:${booking.destinationLongitude},${
                booking.destinationLatitude
              }&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`}
              alt="Route Map"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        {booking.bookingStatus === "PENDING" ? (
          <>
            <button
              onClick={() => handleOnClick("bookingStatus", "PROCEEDED")}
              className="px-6 py-2 bg-secondaryColor text-white rounded-lg hover:bg-cyan-600 transition"
            >
              Proceeded
            </button>
            <button
              onClick={() => handleOnClick("bookingStatus", "NO SHOW")}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              No Show
            </button>
          </>
        ) : (
          booking.bookingStatus === "CANCELLED" && (
            <button
              onClick={() => handleOnClick("bookingStatus", "CANCELLED")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Mark as Refunded
            </button>
          )
        )}

        {booking.paymentStatus === "PENDING" && (
          <button
            onClick={() => handleOnClick("paymentStatus", "CONFIRMED")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalVisible && modalAction && (
        <div className="fixed h-full w-full inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Confirm Update</h2>
            <p className="text-lg mb-6">
              Are you sure you want to update the {modalAction.field} status to{" "}
              <span className="font-semibold">{modalAction.value}</span>?
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
                className="flex-1 px-4 py-2!important bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-300 transition"
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
