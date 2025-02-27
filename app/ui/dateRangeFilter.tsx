"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const DateRangeFilter = ({
  placeholderStart,
  placeholderEnd,
}: {
  placeholderStart: string;
  placeholderEnd: string;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Get the initial date range from URL parameters, if any
  const initialStartDate = searchParams.get("startDate") || "";
  const initialEndDate = searchParams.get("endDate") || "";

  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState<string | null>(null); // State to hold error message

  useEffect(() => {
    // Update the URL query params whenever the date range changes
    const params = new URLSearchParams(searchParams);

    if (startDate) {
      params.set("startDate", startDate);
    } else {
      params.delete("startDate");
    }

    if (endDate) {
      params.set("endDate", endDate);
    } else {
      params.delete("endDate");
    }

    // Replace URL with the updated date range query
    replace(`${pathname}?${params.toString()}`);
  }, [startDate, endDate, pathname, replace, searchParams]);

  // Handler for Start Date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    // Clear the error if the date is valid
    if (endDate && newStartDate > endDate) {
      setError("Start date cannot be later than end date.");
    } else {
      setError(null);
    }
  };

  // Handler for End Date change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    // Check if the end date is earlier than start date
    if (newEndDate && startDate && newEndDate < startDate) {
      setError("End date cannot be earlier than start date.");
    } else {
      setError(null);
    }
  };

  return (
    <div>
      <div className="relative flex flex-1 flex-shrink-0 space-x-2">
        <label htmlFor="startDate" className="sr-only">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          className="block w-full rounded-md border border-gray-200 py-[9px] text-sm placeholder:text-gray-500"
          placeholder={placeholderStart}
          value={startDate}
          onChange={handleStartDateChange}
        />
        <p>{`→`}</p>
        <label htmlFor="endDate" className="sr-only">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          className="block w-full rounded-md border border-gray-200 py-[9px] text-sm placeholder:text-gray-500"
          placeholder={placeholderEnd}
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DateRangeFilter;
