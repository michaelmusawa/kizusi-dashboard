import { BookingData } from "./definitions";

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });
};

// Function to group bookings by categoryName and sum the amounts

export const groupBookingsByCategory = (bookings: BookingData[]) => {
  const categoryTotals: Record<string, number> = {};

  console.log(bookings);

  // Group by category and sum amounts
  bookings.forEach((booking) => {
    const amount = parseFloat(booking.amount);

    if (!categoryTotals[booking.categoryName]) {
      categoryTotals[booking.categoryName] = 0;
    }
    categoryTotals[booking.categoryName] += amount;
  });

  console.log(categoryTotals);

  // Convert to an array of objects with categoryName and categoryTotal
  return Object.entries(categoryTotals).map(
    ([categoryName, categoryTotal]) => ({
      categoryName,
      categoryTotal,
    })
  );
};

// Modified generateYAxis function
export const generateYAxis = (bookings: BookingData[]) => {
  // Step 1: Group the data by categoryName
  const categoryTotals = groupBookingsByCategory(bookings);

  console.log(categoryTotals);

  // Step 2: Find the highest revenue across all categories
  const highestRecord = Math.max(
    ...categoryTotals.map((item) => item.categoryTotal)
  ); // Access categoryTotal from each item
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  // Step 3: Create Y-axis labels
  const yAxisLabels = [];
  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  // Return the Y-axis labels and the top label for scaling
  return { yAxisLabels, topLabel };
};
