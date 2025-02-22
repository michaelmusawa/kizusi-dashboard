import MoneyIcon from "../icons/moneyIcon";
import UserGroupIcon from "../icons/UserGroupIcon";
import Clock from "../icons/Clock";
import Inbox from "../icons/Inbox";
import { lusitana } from "@/app/fonts/fonts";
import { fetchCardData } from "@/app/lib/action";

const iconMap = {
  collected: MoneyIcon,
  customers: UserGroupIcon,
  pending: Clock,
  invoices: Inbox,
};

export default async function CardWrapper({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const {
    numberOfPaidBooking,
    numberOfCancelledBooking,
    totalPaidBookings,
    totalCancelledBookings,
  } = await fetchCardData(startDate, endDate);

  return (
    <>
      <Card title="Collected" value={numberOfPaidBooking} type="collected" />
      <Card title="Pending" value={numberOfCancelledBooking} type="pending" />
      <Card title="Total Invoices" value={totalPaidBookings} type="invoices" />
      <Card
        title="Total Customers"
        value={totalCancelledBookings}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
