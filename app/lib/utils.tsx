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
  return (amount / 1).toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
  });
};

// Function to group bookings by categoryName and sum the amounts

export const groupBookingsByCategory = (bookings: BookingData[]) => {
  const categoryTotals: Record<string, number> = {};

  // Group by category and sum amounts
  bookings.forEach((booking) => {
    const amount = parseFloat(booking.amount);

    if (!categoryTotals[booking.categoryName]) {
      categoryTotals[booking.categoryName] = 0;
    }
    categoryTotals[booking.categoryName] += amount;
  });

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

  // Step 2: Find the highest revenue across all categories
  const highestRecord = Math.max(
    ...categoryTotals.map((item) => item.categoryTotal)
  ); // Access categoryTotal from each item
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  const topValue = (topLabel * 1000) / 1000;

  const numberOfLabels = 10;
  const step = topValue / (numberOfLabels - 1);

  // Step 3: Create Y-axis labels
  const yAxisLabels = [];
  for (let i = 0; i < numberOfLabels; i++) {
    const currentValue = topValue - step * i;
    // Format as "$X.XK" (1 decimal place for precision)
    yAxisLabels.push(
      `$${
        (currentValue / 1000) % 1 === 0
          ? (currentValue / 1000).toFixed(0)
          : (currentValue / 1000).toFixed(1)
      }K`
    );
  }

  // Return the Y-axis labels and the top label for scaling
  return { yAxisLabels, topLabel };
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatTimeToLocal = (
  dateStr: string,
  locale: string = "en-US"
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// utils/truncateText.ts
export function truncateByWords(text: string, wordLimit: number = 3): string {
  if (!text) {
    return "";
  }
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export function toSentenceCase(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const getStatusClass = (status: string) => {
  switch (status) {
    case "PROCEEDED":
      return "text-green-500 bg-green-100";
    case "CONFIRMED":
      return "text-green-500 bg-green-100";
    case "SUCCESS":
      return "text-green-500 bg-green-100";
    case "PENDING":
      return "text-orange-500 bg-orange-100";
    case "NO SHOW":
      return "text-red-500 bg-red-100";
    case "FAILED":
      return "text-red-500 bg-red-100";
    case "CANCELLED":
      return "text-red-500 bg-red-100";
    case "REFUNDED":
      return "text-yellow-500 bg-yellow-100";
    default:
      return "";
  }
};
