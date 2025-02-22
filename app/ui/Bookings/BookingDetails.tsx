"use client";

import React, { useActionState, useState } from "react";
import Image from "next/image";
import { BookingActionState, BookingState } from "@/app/lib/definitions";
import toast from "react-hot-toast";
import { updateBooking } from "@/app/lib/action";
import Link from "next/link";

const BookingDetails = ({ booking }: { booking: BookingState }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const initialState: BookingActionState = {
    message: null,
    errors: {},
    state_error: null,
  };
  const updateBookingWithId = updateBooking.bind(null, booking.id);
  const [state, formAction] = useActionState(updateBookingWithId, initialState);
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

    setIsModalVisible(false);
  } else if (state.state_error) {
    setIsModalVisible(false);
    toast.error(state.state_error, { id: "state_error" });
  }

  const handleOnClick = (field: string, value: string) => {
    setModalAction({ field, value });
    setIsModalVisible(true);
  };

  return (
    <div>
      {/* Booking Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p>
              <span className="font-medium">Booking Type:</span>{" "}
              {booking?.bookType}
            </p>
            <p>
              <span className="font-medium">Departure:</span>{" "}
              {booking?.departure}
            </p>
            {booking.bookType === "transfer" && (
              <p>
                <span className="font-medium">Destination:</span>{" "}
                {booking?.destination}
              </p>
            )}
            <p>
              <span className="font-medium">Payment Type:</span>{" "}
              {booking?.paymentType}
            </p>
            <p>
              <span className="font-medium">Payment Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded ${
                  booking?.paymentStatus === "CONFIRMED"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {booking?.paymentStatus}
              </span>
            </p>
            <p>
              <span className="font-medium">Booking Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded ${getStatusColor(
                  booking?.bookingStatus
                )}`}
              >
                {booking?.bookingStatus}
              </span>
            </p>
          </div>

          {/* Map Section */}
          {booking && (
            <div>
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
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          <Link
            href={`/dashboard/transactions?query=${booking.id}`}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            View transactions
          </Link>
          {booking?.bookingStatus === "PENDING" ? (
            <>
              <button
                onClick={() => handleOnClick("bookingStatus", "PROCEEDED")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Proceeded
              </button>
              <button
                onClick={() => handleOnClick("bookingStatus", "NO SHOW")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                No show up
              </button>
            </>
          ) : (
            booking?.bookingStatus === "CANCELLED" && (
              <button
                onClick={() => handleOnClick("bookingStatus", "CANCELLED")}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Mark as refunded
              </button>
            )
          )}

          {booking?.paymentStatus === "PENDING" && (
            <button
              onClick={() => handleOnClick("paymentStatus", "CONFIRMED")}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Modal for confirmation */}
      {isModalVisible && modalAction && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to update this booking status to{" "}
              {modalAction.value}?
            </h2>
            <div>
              <form action={formAction}>
                <input
                  type="text"
                  name={modalAction.field}
                  defaultValue={modalAction.value}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-4"
                >
                  Yes
                </button>
              </form>

              <button
                onClick={() => setIsModalVisible(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
