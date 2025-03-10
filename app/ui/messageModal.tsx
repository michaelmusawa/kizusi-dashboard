"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SuccessMessageProps {
  message: string;
  deleted?: boolean;
  duration?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  deleted,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      const url = new URL(window.location.href);

      if (deleted) {
        url.searchParams.delete("deleted");
      } else {
        url.searchParams.delete("success");
      }

      router.replace(url.pathname, { scroll: false });
    }, duration);

    return () => clearTimeout(timer);
  }, [deleted, duration, router]);

  if (!visible) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="flex w-full p-2 bg-green-200 justify-center items-center mb-4"
    >
      <p className="text-sm text-green-700 text-center">{message}</p>
    </div>
  );
};

export default SuccessMessage;
