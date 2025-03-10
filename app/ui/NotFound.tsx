"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowRightIcon from "./icons/arrowRight";

export default function GoBackAndLogin() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button
        onClick={() => router.back()}
        className="flex-1 flex items-center justify-center px-4 py-2 gap-2 bg-secondaryColor text-primaryColor rounded hover:bg-cyan-600 transition"
      >
        <ArrowRightIcon className="w-4 rotate-180" /> Go Back
      </button>
      <Link
        href="/"
        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
      >
        Login
      </Link>
    </div>
  );
}
