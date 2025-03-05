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

        const isNotificationLink = link.name === "Notifications";
        const notificationTextClass =
          notify > 0 && link.name === "Notifications"
            ? "text-primaryColor"
            : "text-gray-600";

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-[rgba(88,184,201,0.15)] hover:text-primaryColor md:flex-none md:justify-start md:p-2 md:px-3",
              pathname === "/dashboard"
                ? "bg-[rgba(88,184,201,0.2)] text-primaryColor"
                : pathname.includes(link.href) && link.href !== "/dashboard"
                ? "bg-[rgba(88,184,201,0.2)] text-primaryColor"
                : "bg-gray-50"
            )}
          >
            <LinkIcon
              className={clsx("w-6", {
                "animate-shake": isNotificationLink && notify > 0,
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
