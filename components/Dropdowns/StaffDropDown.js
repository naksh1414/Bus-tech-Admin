import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AssignDutyModal from "components/Modals/AssignDuty";
const StaffDropDown = ({ staffId, onSuccess, assignedBusId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const handleWindowReload = () => {
    window.location.reload();
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const config = {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzU5ZTY2ZTI5YTViMmY0NDI2NzkyNDgiLCJpYXQiOjE3MzM5NDUzNzgsImV4cCI6MTczNDU1MDE3OH0.s4EsZxbV1Pddiynpv9ZrRcHFG74c0a3iLRz8AXDfuxc",
          },
        };

        await axios.delete(
          `http://localhost:3030/api/v1/staff/${staffId}`,
          config
        );
        onSuccess();
        setIsOpen(false);
      } catch (error) {
        console.error("Error deleting staff:", error);
        alert("Failed to delete staff member");
      }
    }
  };

  const handleAssignDuty = async () => {
    const config = {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzU5ZTY2ZTI5YTViMmY0NDI2NzkyNDgiLCJpYXQiOjE3MzM5NDUzNzgsImV4cCI6MTczNDU1MDE3OH0.s4EsZxbV1Pddiynpv9ZrRcHFG74c0a3iLRz8AXDfuxc",
      },
    };
    // You can implement a modal for duty assignment here
    const details = await axios.get(
      `http://localhost:3030/api/v1/staff/${staffId}`,
      config
    );
    console.log("Staff details:", details);
    if (details.data.assignedBusId) {
      alert("Staff member is already assigned to a bus");
    } else {
      setIsAssignModalOpen(true);
    }
    console.log("Assign duty clicked for staff:", staffId);
    setIsOpen(false);
  };
  const handleUnAssignDuty = async () => {
    const config = {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzU5ZTY2ZTI5YTViMmY0NDI2NzkyNDgiLCJpYXQiOjE3MzM5NDUzNzgsImV4cCI6MTczNDU1MDE3OH0.s4EsZxbV1Pddiynpv9ZrRcHFG74c0a3iLRz8AXDfuxc",
      },
    };
    // You can implement a modal for dutIy assignment here
    const details = await axios.post(
      `http://localhost:3030/api/v1/staff/${staffId}/unassign-bus`,
      config
    );
    console.log("details:", details);
    handleWindowReload();
    console.log("Un Assign duty clicked for staff:", staffId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="text-blueGray-500 py-1 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-ellipsis-v"></i>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <button
              className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={handleAssignDuty}
              role="menuitem"
            >
              {assignedBusId ? "" : "Assign Duty"}
            </button>
            {assignedBusId && (
              <button
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={handleAssignDuty}
                role="menuitem"
              >
                Update Duty
              </button>
            )}
            {assignedBusId && (
              <button
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={handleUnAssignDuty}
                role="menuitem"
              >
                Un Assign Duty
              </button>
            )}
            <button
              className="text-red-600 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              onClick={handleDelete}
              role="menuitem"
            >
              Delete Staff
            </button>
          </div>
        </div>
      )}
      <AssignDutyModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        staffId={staffId}
        onSuccess={() => {
          handleWindowReload();
          setIsAssignModalOpen(false);
        }}
      />
    </div>
  );
};

export default StaffDropDown;
