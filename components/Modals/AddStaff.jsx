import React, { useState } from 'react';
import axios from 'axios';

const AddStaffModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'DRIVER', 
    contactNumber: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzU5ZTY2ZTI5YTViMmY0NDI2NzkyNDgiLCJpYXQiOjE3MzM5NDUzNzgsImV4cCI6MTczNDU1MDE3OH0.s4EsZxbV1Pddiynpv9ZrRcHFG74c0a3iLRz8AXDfuxc"
        }
      };

      const response = await axios.post(
        'http://localhost:3030/api/v1/staff',
        formData,
        config
      );

      if (response.status === 201) {
        onSuccess();
        onClose();
        setFormData({
          name: '',
          email: '',
          role: 'DRIVER',
          contactNumber: '',
          password: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-0 left-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-100 w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Staff</h3>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="DRIVER">Driver</option>
                <option value="CONDUCTOR">Conductor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex justify-end gap-4">
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
                Add Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;