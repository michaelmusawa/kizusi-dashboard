import MoneyIcon from "../icons/moneyIcon";
import UserGroupIcon from "../icons/UserGroupIcon";
import Clock from "../icons/Clock";
import { lusitana } from "@/app/fonts/fonts";
import { fetchCardData } from "@/app/lib/action";

const iconMap = {
  collected: UserGroupIcon,
  customers: MoneyIcon,
  pending: Clock,
  invoices: MoneyIcon,
};

export default async function CardWrapper({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const {
    numberOfClients,
    numberOfReservedBooking,
    totalPaidBookings,
    totalReservedBookings,
  } = await fetchCardData(startDate, endDate);

  return (
    <>
      <Card title="Clients" value={numberOfClients} type="collected" />
      <Card
        title="Reservations"
        value={numberOfReservedBooking}
        type="pending"
      />
      <Card
        title="Total reservations"
        value={totalPaidBookings}
        type="invoices"
      />
      <Card
        title="Total paid amount"
        value={totalReservedBookings}
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
