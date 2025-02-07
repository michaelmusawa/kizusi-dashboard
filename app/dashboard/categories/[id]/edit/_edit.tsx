"use client";

import { deleteCategory, updateCategory } from "@/app/lib/action";
import { CarActionState, CategoryState } from "@/app/lib/definitions";
import { ConfirmModal } from "@/app/ui/confirmationModal";
import CategoryForm from "@/app/ui/forms/categoryForm";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import toast from "react-hot-toast";

const EditCategory = ({
  category,
  id,
}: {
  category: CategoryState;
  id: string;
}) => {
  const initialState: CarActionState = {
    message: null,
    errors: {},
    state_error: null,
  };
  const updateCategoryWithId = updateCategory.bind(null, id);
  const [state, formAction] = useActionState(
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

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Edit category</h1>
        <button
          onClick={() => setIsModalVisible(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default EditCategory;
