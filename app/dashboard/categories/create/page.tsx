"use client";

import { createCategory } from "@/app/lib/action";
import { CategoryActionState } from "@/app/lib/definitions";
import CategoryForm from "@/app/ui/forms/categoryForm";
import Link from "next/link";
import React, { useActionState } from "react";
import toast from "react-hot-toast";

const Page: React.FC = () => {
  const initialState: CategoryActionState = {
    message: null,
    state_error: null,
    errors: {},
  };

  const [state, formAction] = useActionState(createCategory, initialState);

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
        <h1 className="text-2xl font-bold mb-6">Add car category</h1>
        <form action={formAction}>
          <CategoryForm />

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Submit
            </button>
            <Link href={"/dashboard/categories"}>
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

export default Page;
