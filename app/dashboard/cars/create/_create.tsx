"use client";

import { createCar } from "@/app/lib/action";
import { CarActionState, CategoryState } from "@/app/lib/definitions";
import CarForm from "@/app/ui/forms/carForm";
import ArrowRightIcon from "@/app/ui/icons/arrowRight";
import Link from "next/link";
import router from "next/router";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

const CreateCar = ({ categories }: { categories: CategoryState[] }) => {
  const initialState: CarActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const [state, formAction, isPending] = useActionState(
    createCar,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast.error(state.message, { id: "error" });
      } else {
        toast.success(state.message, { id: "success" });
        const timer = setTimeout(() => {
          router.push("/dashboard/cars/create");
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else if (state.state_error) {
      toast.error(state.state_error, { id: "state_error" });
    }
  }, [state, router]);

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
        <form action={formAction}>
          <CarForm categories={categories} />
          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href={"/dashboard/cars"}
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

export default CreateCar;
