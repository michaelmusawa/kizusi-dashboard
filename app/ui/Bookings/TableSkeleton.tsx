import React from "react";

const BookingsTableSkeleton = () => {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="min-w-full bg-white border border-gray-300 mx-auto">
        <thead className="bg-[rgba(88,184,201,0.2)] text-secondaryColor max-lg:text-sm max-sm:text-xs">
          <tr>
            {Array(13)
              .fill("")
              .map((_, index) => (
                <th key={index} className="border px-4 py-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array(5)
            .fill("")
            .map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 text-gray-700 font-medium"
              >
                {Array(13)
                  .fill("")
                  .map((_, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTableSkeleton;
