import React, { useState } from "react";
import axios from "axios";

// First, let's create the AssignDutyModal component
const AssignDutyModal = ({ isOpen, onClose, staffId, onSuccess }) => {
  const [formData, setFormData] = useState({
    busId: "",
    routeId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzU5ZTY2ZTI5YTViMmY0NDI2NzkyNDgiLCJpYXQiOjE3MzM5NDUzNzgsImV4cCI6MTczNDU1MDE3OH0.s4EsZxbV1Pddiynpv9ZrRcHFG74c0a3iLRz8AXDfuxc",
        },
      };

      await axios.post(
        `http://localhost:3030/api/v1/staff/${staffId}/assign-bus`,
        {
          busId: formData.busId,
        },
        config
      );

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error assigning duty:", error);
      alert("Failed to assign duty");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-left top-0 left-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Assign Duty
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Bus ID
              </label>
              <input
                type="text"
                value={formData.busId}
                onChange={(e) =>
                  setFormData({ ...formData, busId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-4 space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-lightBlue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Assign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AssignDutyModal;
