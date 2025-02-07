"use client";

import { deleteCar, updateCar } from "@/app/lib/action";
import { CarActionState, CarState, CategoryState } from "@/app/lib/definitions";
import { ConfirmModal } from "@/app/ui/confirmationModal";
import CarForm from "@/app/ui/forms/carForm";
import { useRouter } from "next/navigation";
import React, { useActionState, useState } from "react";
import toast from "react-hot-toast";

const EditCar = ({
  car,
  id,
  categories,
}: {
  car: CarState;
  id: number;
  categories: CategoryState[] | undefined;
}) => {
  const initialState: CarActionState = {
    message: null,
    errors: {},
    state_error: null,
  };
  const updateCarWithId = updateCar.bind(null, id);
  const [state, formAction] = useActionState(updateCarWithId, initialState);

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

  const handleDelete = async (id: number) => {
    try {
      await deleteCar(id);
      console.log("Item deleted!");
      setIsModalVisible(false);
      router.replace("/dashboard/cars");
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
        <h1 className="text-2xl font-bold mb-6">Edit car</h1>
        <button
          onClick={() => setIsModalVisible(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Delete Car
        </button>

        {isModalVisible && (
          <ConfirmModal
            onConfirm={() => handleDelete(id)}
            onCancel={handleCancel}
          />
        )}
      </div>

      <form action={formAction}>
        <CarForm car={car} categories={categories} />

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

export default EditCar;
