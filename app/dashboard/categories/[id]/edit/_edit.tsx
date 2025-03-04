"use client";

import { deleteCategory, updateCategory } from "@/app/lib/action";
import { CarActionState, CategoryState } from "@/app/lib/definitions";
import { ConfirmModal } from "@/app/ui/confirmationModal";
import CategoryForm from "@/app/ui/forms/categoryForm";
import ArrowRightIcon from "@/app/ui/icons/arrowRight";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import toast from "react-hot-toast";

const EditCategory = ({
  category,
  id,
}: {
  category: CategoryState;
  id: number;
}) => {
  const initialState: CarActionState = {
    message: null,
    errors: {},
    state_error: null,
  };
  const updateCategoryWithId = updateCategory.bind(null, id);
  const [state, formAction, isPending] = useActionState(
    updateCategoryWithId,
    initialState
  );

  if (state.message) {
    if (state.errors) {
      toast.error(state.message, {
        id: "error",
      });
    }
  } else if (state.state_error) {
    toast.error(state.state_error, { id: "state_error" });
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      console.log("Item deleted!");
      setIsModalVisible(false);
      router.replace("/dashboard/categories");
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
        className="flex items-center justify-center gap-2 mt-4 border border-gray-300 rounded-lg p-2 bg-secondaryColor text-white w-full"
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
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Edit category</h1>
        <button
          onClick={() => setIsModalVisible(true)}
          className="p-2 bg-[rgba(88,184,201,0.8)] text-white rounded-lg hover:bg-[rgba(88,184,201)]"
        >
          Delete Category
        </button>

        {isModalVisible && (
          <ConfirmModal
            onConfirm={() => handleDelete(id)}
            onCancel={handleCancel}
          />
        )}
      </div>

      <form action={formAction}>
        <CategoryForm category={category} />

        <div className="flex justify-between">
          <SubmitButton />
        </div>
      </form>
    </>
  );
};

export default EditCategory;
