import { CategoryState } from "@/app/lib/definitions";
import { useState } from "react";
import Cancel from "../icons/Cancel";

const CategoryForm: React.FC<{ category?: CategoryState }> = ({ category }) => {
  const [brands, setBrands] = useState<string[]>(
    category?.brands ? category.brands.map((b) => ({ brand: b.brandName })) : []
  );

  const [existingBrands, setExistingBrands] = useState<string[]>([
    "Toyota",
    "Honda",
    "Tesla",
    "BMW",
    "Benz",
  ]);

  const handleAddBrand = () => {
    setBrands([...brands, { brand: "" }]);
  };

  const handleBrandChange = (index: number, field: string) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = { ...updatedBrands[index], brand: field };
    setBrands(updatedBrands);
  };

  const handleRemoveBrand = (index: number) => {
    const updatedBrands = brands.filter((_, i) => i !== index);
    setBrands(updatedBrands);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block font-medium mb-2">Category name</label>
        <input
          type="text"
          name="name"
          defaultValue={category?.categoryName ?? ""}
          placeholder="Enter category name"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Brands</label>

        {brands.map((brand, index) => (
          <div key={index} className="flex space-x-4 mb-2">
            {/* Dropdown for existing brands or input field for a new brand */}
            <input
              list="brand-options"
              name="brand"
              defaultValue={brand.brand}
              className="w-1/3 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
              onChange={(e) => handleBrandChange(index, e.target.value)}
              required
            />

            <datalist id="brand-options">
              {existingBrands.map((b, index) => (
                <option key={index} value={b} />
              ))}
            </datalist>

            <button
              type="button"
              onClick={() => handleRemoveBrand(index)}
              className="text-primaryColor"
            >
              <Cancel />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddBrand}
          className="text-secondaryColor"
        >
          Add Brand
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Price</label>
        <input
          name="price"
          defaultValue={category?.price ?? ""}
          type="number"
          placeholder="Enter price"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Description</label>
        <textarea
          name="description"
          defaultValue={category?.description ?? ""}
          placeholder="Enter car description"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
          rows={4}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Image</label>
        <input
          type="text"
          name="image"
          defaultValue={category?.imageUrl ?? ""}
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-secondaryColor"
          accept="image/*"
          required
        />
      </div>
    </>
  );
};

export default CategoryForm;
