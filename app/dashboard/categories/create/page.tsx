"use client";

import { createCategory } from "@/app/lib/action";
import { CategoryActionState } from "@/app/lib/definitions";
import CategoryForm from "@/app/ui/forms/categoryForm";
import ArrowRightIcon from "@/app/ui/icons/arrowRight";
import Link from "next/link";
import React, { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

const Page: React.FC = () => {
  const initialState: CategoryActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    createCategory,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast.error(state.message, { id: "error" });
      } else {
        toast.success(state.message, { id: "success" });
      }
    } else if (state.state_error) {
      toast.error(state.state_error, { id: "state_error" });
    }
  }, [state]);

  function SubmitButton() {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isPending) {
        e.preventDefault();
      }
    };

    return (
      <button
        type="submit"
        disabled={isPending}
        onClick={handleClick}
        className="flex flex-1 items-center justify-center gap-2 border border-gray-300 rounded-lg p-2 bg-secondaryColor text-white w-full hover:bg-cyan-600"
      >
        {isPending ? "Submitting..." : "Submit"}
        {isPending ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        ) : (
          <ArrowRightIcon className="w-4" />
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-3 md:p-6">
        <h1 className="text-lg md:text-2xl font-bold mb-6">Add car category</h1>
        <form action={formAction}>
          <CategoryForm />

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href={"/dashboard/categories"}
              className="flex-1 items-center justify-center"
            >
              <button className="bg-gray-100 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg w-full">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
