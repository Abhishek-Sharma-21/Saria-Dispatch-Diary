import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function DispatchForm({
  dispatches,
  setDispatches,
  addRow,
  removeRow,
  totalWeight,
}) {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (index, field, value) => {
    const updated = [...dispatches];
    updated[index][field] = value;
    setDispatches(updated);
  };

  const handleSubmit = async () => {
    console.log(dispatches);
    try {
      // Send all dispatches in a single request
      await axios.post(`${apiUrl}/dispatches/bulk`, { dispatches });
      toast.success("Dispatches submitted!");
      // Clear the form: reset to a single empty row
      setDispatches([{ supplier: "", vehicle: "", weight: "" }]);
    } catch (err) {
      toast.error("Error submitting dispatches");
    }
  };

  return (
    <div>
      {dispatches.map((item, index) => (
        <div
          key={index}
          className="mb-4 p-3 rounded-lg bg-gray-50 shadow-sm border"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <input
              className="border p-2 rounded w-full text-sm"
              placeholder="Supplier"
              value={item.supplier}
              onChange={(e) => handleChange(index, "supplier", e.target.value)}
            />
            <input
              className="border p-2 rounded w-full text-sm"
              placeholder="Vehicle No."
              value={item.vehicle}
              onChange={(e) => handleChange(index, "vehicle", e.target.value)}
            />
            <input
              type="number"
              className="border p-2 rounded w-full text-sm"
              placeholder="Weight (MT)"
              value={item.weight}
              onChange={(e) => handleChange(index, "weight", e.target.value)}
            />
          </div>
          <div className="text-right mt-2">
            <button
              onClick={() => removeRow(index)}
              className="text-red-600 text-sm font-medium hover:underline"
            >
              X Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={addRow}
          className="bg-green-600 sm:w-32 text-white text-base px-4 py-3 rounded hover:bg-green-700"
        >
          + Add Row
        </button>

        <div className="text-right font-semibold text-lg">
          Total Weight: {totalWeight.toFixed(3)} MT
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600  text-white text-base px-4 py-3 rounded hover:bg-blue-700"
        >
          Submit Day's Dispatch
        </button>
      </div>
    </div>
  );
}
