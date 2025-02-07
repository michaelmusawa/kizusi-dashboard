"use client";

import HomeIcon from "../icons/HomeIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Truck from "../icons/truck";
import RecordIcon from "../icons/recordIcon";
import EllipsisIcon from "../icons/ellipsisIcon";
import NotificationIcon from "../icons/Notification";
import MoneyIcon from "../icons/moneyIcon";
import TransactionIcon from "../icons/transactionIcon";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Cars",
    href: "/dashboard/cars",
    icon: Truck,
  },
  { name: "Bookings", href: "/dashboard/bookings", icon: RecordIcon },
  { name: "Categories", href: "/dashboard/categories", icon: EllipsisIcon },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: TransactionIcon,
  },
  { name: "Payments", href: "/dashboard/payments", icon: MoneyIcon },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: NotificationIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
