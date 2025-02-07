"use client";

import { useEffect, useState } from "react";

interface SuccessMessageProps {
  message: string;
  duration?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  duration = 3000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div aria-live="polite" aria-atomic="true" className="mb-4">
      <p className="text-sm text-green-500 text-center">{message}</p>
    </div>
  );
};

export default SuccessMessage;
