import React from "react";
import { fetchFilteredTransactions } from "../lib/action";
import Link from "next/link";

const TransactionsTable = async ({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) => {
  const transactions = await fetchFilteredTransactions(query, currentPage);

  console.log(transactions);

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
            <th className="p-4 border-b font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{index + 1}</td>
              <td className="p-4 border-b">{transaction.id}</td>
              <td className="p-4 border-b">{transaction.reference}</td>
              <td className="p-4 border-b">{transaction.amount}</td>
              <td className="p-4 border-b">{transaction.bookId}</td>
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
              <td className="p-4 border-b">
                <Link
                  href={`/dashboard/transactions/${transaction.id}/display`}
                >
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

export default TransactionsTable;
