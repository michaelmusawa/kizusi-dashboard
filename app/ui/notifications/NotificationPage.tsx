import { fetchFilteredBookings } from "@/app/lib/action";

import NotificationTable from "./NotificationTable";

const NotificationPage = async ({
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
  const notification = "false";

  const bookings = await fetchFilteredBookings(
    query,
    startDate,
    endDate,
    currentPage,
    notification
  );

  return <NotificationTable bookings={bookings} />;
};

export default NotificationPage;

// Reuse your existing getStatusColor function
