"use client";

import HomeIcon from "../icons/HomeIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import RecordIcon from "../icons/recordIcon";
import NotificationIcon from "../icons/Notification";
import MoneyIcon from "../icons/moneyIcon";
import Category from "../icons/Category";
import Car from "../icons/Car";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Cars",
    href: "/dashboard/cars",
    icon: Car,
  },
  { name: "Categories", href: "/dashboard/categories", icon: Category },
  { name: "Bookings", href: "/dashboard/bookings", icon: RecordIcon },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: MoneyIcon,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: NotificationIcon,
  },
];

export default function NavLinks({ notify }: { notify: number }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        // Check if it's the Notifications link and apply special styles if notify > 0
        const isNotificationLink = link.name === "Notifications";
        const notificationTextClass =
          notify > 0 && link.name === "Notifications"
            ? "text-red-500" // Change text color for notifications
            : "text-gray-600"; // Default text color

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
            <LinkIcon
              className={clsx("w-6", {
                "animate-shake": isNotificationLink && notify > 0, // Apply shake only to icon if notify > 0
              })}
            />
            <p className={clsx("hidden md:block", notificationTextClass)}>
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}
