import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function BookEquipment() {
  const { equipmentType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    date: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking confirmed for a ${equipmentType}!`);
    navigate("/dashboard");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col text-sm md:text-base">
      {/* Topbar */}
      <Topbar />

      {/* Layout */}
      <div className="pt-24 px-4 md:px-8 flex-1 flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        {/* Booking Form Section */}
        <div className="flex-1 flex flex-col items-center justify-start mt-8">
          <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              Book  {equipmentType}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="text"
                name="contact"
                placeholder="Phone or Email"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (in days)"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookEquipment;
