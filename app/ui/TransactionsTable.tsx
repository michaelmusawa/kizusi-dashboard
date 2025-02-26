import React from "react";
import { fetchFilteredTransactions } from "../lib/action";

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

            <th className="p-4 border-b font-medium">ID</th>
            <th className="p-4 border-b font-medium">Reference</th>
            <th className="p-4 border-b font-medium">Amount</th>
            <th className="p-4 border-b font-medium">Booking ID</th>
            <th className="p-4 border-b font-medium">Date & Time</th>
            <th className="p-4 border-b font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{index + 1}</td>
              <td className="p-4 border-b">{transaction.id}</td>
              <td className="p-4 border-b">{transaction.reference}</td>
              <td className="p-4 border-b">{transaction.amount}</td>
              <td className="p-4 border-b">{transaction.bookingId}</td>
              <td className="p-4 border-b">
                {transaction.createdAt.toString()}
              </td>
              <td className="p-4 border-b">
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
