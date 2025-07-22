import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BookEquipment() {
  const { equipmentType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    date: '',
    duration: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking confirmed for a ${equipmentType}!`);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 capitalize">Book a {equipmentType}</h2>
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
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookEquipment;
