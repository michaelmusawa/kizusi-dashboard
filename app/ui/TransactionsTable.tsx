import React from "react";
import { fetchFilteredTransactions } from "../lib/action";
import {
  formatCurrency,
  formatDateToLocal,
  formatTimeToLocal,
  getStatusClass,
} from "../lib/utils";

const TransactionsTable = async ({
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
  const transactions = await fetchFilteredTransactions(
    query,
    startDate,
    endDate,
    currentPage
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 mx-auto">
        <thead className="bg-[rgba(88,184,201,0.2)] text-secondaryColor max-lg:text-sm max-sm:text-xs">
          <tr>
            <th className="border px-4 py-2">No.</th>

            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Reference</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Booking ID</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={index}
              className="max-lg:text-sm max-sm:text-xs hover:bg-gray-50 text-gray-700 font-medium"
            >
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{transaction.id}</td>
              <td className="border px-4 py-2">{transaction.reference}</td>
              <td className="border px-4 py-2">
                {formatCurrency(transaction.amount)}
              </td>
              <td className="border px-4 py-2">{transaction.bookingId}</td>
              <td className="border px-4 py-2">
                {formatDateToLocal(transaction.createdAt.toString())}
              </td>
              <td className="border px-4 py-2">
                {formatTimeToLocal(transaction.createdAt.toString())}
              </td>
              <td className="border px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                    transaction.status
                  )}`}
                >
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
