// App.jsx
import React, { useState } from "react";
import DispatchForm from "./components/DispatchForm";
import PreviousDispatch from "./components/PreviousDispatch";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [activeTab, setActiveTab] = useState("form");
  const [dispatches, setDispatches] = useState([
    { supplier: "", vehicle: "", weight: "" },
  ]);

  const addRow = () =>
    setDispatches([...dispatches, { supplier: "", vehicle: "", weight: "" }]);
  const removeRow = (index) =>
    setDispatches(dispatches.filter((_, i) => i !== index));
  const totalWeight = dispatches.reduce(
    (sum, item) => sum + (parseFloat(item.weight) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6">
        <h1 className="text-3xl sm:text-5xl font-bold text-red-700 text-center mb-6">
          Saria Dispatch Diary
        </h1>

        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-4 py-2 font-semibold text-sm rounded ${
              activeTab === "form"
                ? "bg-red-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Dispatch Form
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-4 py-2 font-semibold text-sm rounded ${
              activeTab === "previous"
                ? "bg-red-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Prev Dispatch
          </button>
        </div>

        {activeTab === "form" ? (
          <DispatchForm
            dispatches={dispatches}
            setDispatches={setDispatches}
            addRow={addRow}
            removeRow={removeRow}
            totalWeight={totalWeight}
          />
        ) : (
          <PreviousDispatch />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t flex justify-around sm:hidden">
        <button
          onClick={() => setActiveTab("form")}
          className={`w-1/2 py-3 font-semibold text-sm ${
            activeTab === "form"
              ? "text-red-700 border-b-2 border-red-700"
              : "text-gray-500"
          }`}
        >
          Dispatch Form
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={`w-1/2 py-3 font-semibold text-sm ${
            activeTab === "previous"
              ? "text-red-700 border-b-2 border-red-700"
              : "text-gray-500"
          }`}
        >
          Prev Dispatch
        </button>
      </div>
    </div>
  );
}
