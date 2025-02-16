"use client";

import { CarState, CategoryState } from "@/app/lib/definitions";
import React, { useEffect, useState } from "react";

const CarForm: React.FC<{
  car?: CarState;
  categories: CategoryState[] | undefined;
}> = ({ car, categories }) => {
  const [features, setFeatures] = useState<{ name: string; value: string }[]>(
    car?.features
      ? car.features.map((f) => ({
          name: f.featureName,
          value: f.featureValue,
        }))
      : []
  );

  const [addons, setAddons] = useState<{ name: string; value: number }[]>(
    car?.addons
      ? car.addons.map((f) => ({
          name: f.addonName,
          value: f.addonValue,
        }))
      : []
  );

  const [category, setCategory] = useState<string>(car?.category.name ?? "");
  const [brand, setBrand] = useState<string>(car?.brand.brandName ?? "");

  const [brands, setBrands] = useState<string[]>([]);
  const [localCategories, setLocalCategories] = useState<string[]>(
    () => categories?.map((c) => c.name) ?? []
  );

  useEffect(() => {
    if (category) {
      const selectedCategory = categories?.find((c) => c.name === category);
      if (selectedCategory) {
        setBrands(selectedCategory.brands.map((b) => b.brandName));
      } else {
        setBrands([]); // Clear brands if no category is selected or found
      }
    }
  }, [category, categories]);

  const handleAddFeature = () => {
    setFeatures([...features, { name: "", value: "" }]);
  };

  const handleAddAddon = () => {
    setAddons([...addons, { name: "", value: 0 }]);
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFeatures(updatedFeatures);
  };

  const handleAddonChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedAddons = [...addons];
    updatedAddons[index] = { ...updatedAddons[index], [field]: value };
    setAddons(updatedAddons);
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  const handleRemoveAddon = (index: number) => {
    const updatedAddons = addons.filter((_, i) => i !== index);
    setAddons(updatedAddons);
  };

  console.log("beginning category", car?.brand.brandName);

  return (
    <>
      <div className="mb-4">
        <label className="block font-medium mb-2">Car Name</label>
        <input
          type="text"
          defaultValue={car?.name ?? ""}
          name="name"
          placeholder="Enter car name"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Category</label>
        <select
          name="category"
          defaultValue={car?.category.name ?? ""}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {localCategories.length > 0 &&
            localCategories.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Brand</label>
        <select
          name="brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Brand</option>
          {brands.length > 0 &&
            brands.map((b, index) => (
              <option key={index} value={b}>
                {b}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Features</label>
        {/* <input type="hidden" name="features" value={features}/> */}
        {features.map((feature, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <select
              name="feature"
              className="w-1/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={feature.name}
              onChange={(e) =>
                handleFeatureChange(index, "name", e.target.value)
              }
              required
            >
              <option value="">Select Feature</option>
              <option value="Doors">Doors</option>
              <option value="Seats">Seats</option>
              <option value="Engine">Engine</option>
              <option value="Transmission">Transmission</option>
            </select>
            <input
              type="text"
              name="value"
              placeholder="Value"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={feature.value}
              onChange={(e) =>
                handleFeatureChange(index, "value", e.target.value)
              }
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveFeature(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddFeature}
          className="text-blue-500"
        >
          Add Feature
        </button>
      </div>

      {/* Add addons */}

      <div className="mb-4">
        <label className="block font-medium mb-2">Addons</label>

        {addons.map((addon, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            <select
              name="addon"
              className="w-1/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addon.name}
              onChange={(e) => handleAddonChange(index, "name", e.target.value)}
              required
            >
              <option value="">Select an Addon</option>
              <option value="Bluetooth">Bluetooth</option>
              <option value="WiFi">WiFi</option>
              <option value="Water">Water</option>
              <option value="Charger">Charger</option>
              <option value="GPS">GPS</option>
              <option value="Baby Seat">Baby Seat</option>
              <option value="Roof Rack">Roof Rack</option>
            </select>

            <input
              type="number"
              name="value"
              placeholder="Value"
              className="w-2/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={addon.value}
              onChange={(e) =>
                handleAddonChange(index, "value", +e.target.value)
              }
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveAddon(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAddon}
          className="text-blue-500"
        >
          Add Addon
        </button>
      </div>

      {/* End of addons  */}

      {/* <div className="mb-4">
        <label className="block font-medium mb-2">Addons</label>
        <div className="flex space-x-4 mb-2">
          <select
            className="w-2/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              if (e.target.value && !addons.includes(e.target.value)) {
                handleAddAddon(e.target.value);
              }
            }}
          >
            <option value="">Select an Addon</option>
            <option value="Bluetooth">Bluetooth</option>
            <option value="WiFi">WiFi</option>
            <option value="Water">Water</option>
            <option value="Charger">Charger</option>
            <option value="GPS">GPS</option>
            <option value="Baby Seat">Baby Seat</option>
            <option value="Roof Rack">Roof Rack</option>
          </select>
        </div>
        <div className="flex flex-wrap space-x-2">
          {addons.map((addon, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center space-x-2"
            >
              <span>{addon}</span>
              <input type="hidden" name="addon" value={addon} />
              <button
                type="button"
                onClick={() => handleRemoveAddon(addon)}
                className="text-red-500 ml-2"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div> */}

      <div className="mb-4">
        <label className="block font-medium mb-2">Description</label>
        <textarea
          name="description"
          defaultValue={car?.description}
          placeholder="Enter car description"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Price</label>
        <input
          name="price"
          defaultValue={car?.price}
          type="number"
          placeholder="Enter price"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Image Url</label>
        <input
          name="image"
          defaultValue={car?.image}
          type="text"
          placeholder="Image url"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {/* <input
          type="file"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
          required
        /> */}
      </div>
    </>
  );
};

export default CarForm;
