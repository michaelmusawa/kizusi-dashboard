"use client";

import { createCar } from "@/app/lib/action";
import { CarActionState, CategoryState } from "@/app/lib/definitions";
import CarForm from "@/app/ui/forms/carForm";
import Link from "next/link";
import { useActionState } from "react";
import toast from "react-hot-toast";
const CreateCar = ({ categories }: { categories: CategoryState[] }) => {
  const initialState: CarActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const [state, formAction] = useActionState(createCar, initialState);

  if (state.message) {
    if (state.errors) {
      toast.error(state.message, {
        id: "error",
      });
    } else {
      toast.success(state.message, {
        id: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  } else if (state.state_error) {
    toast.error(state.state_error, { id: "state_error" });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Car</h1>
        <form action={formAction}>
          <CarForm categories={categories} />
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Submit
            </button>
            <Link href={"/dashboard/cars"}>
              <button className="bg-gray-500 text-white px-6 py-2 rounded-lg">
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
