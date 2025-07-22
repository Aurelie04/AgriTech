import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgricultureInsurance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    type: 'crop',
    bundle: false,
    description: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8081/api/insurance/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Your insurance request has been submitted!');
      navigate('/dashboard');
    } else {
      alert('Failed to submit insurance request');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error submitting form. Please try again later.');
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Apply for Agriculture Insurance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Insurance Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="crop">Crop Insurance</option>
            <option value="asset">Asset Insurance</option>
            <option value="weather">Weather-indexed Insurance</option>
          </select>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="bundle"
              checked={formData.bundle}
              onChange={handleChange}
            />
            <span>Bundle with agri-loan or equipment</span>
          </label>
        </div>
        <div>
          <label className="block font-medium">Additional Info</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default AgricultureInsurance;
