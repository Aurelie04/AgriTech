import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

function TransportLogisticForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    productName: '',
    quantity: '',
    destination: '',
    date: '',
    vehicleType: 'bakkie',
    pickupAddress: '',
    note: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      productName: '',
      quantity: '',
      destination: '',
      date: '',
      vehicleType: 'bakkie',
      pickupAddress: '',
      note: ''
    });
    setSubmitted(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      fullName,
      productName,
      quantity,
      destination,
      date,
      vehicleType,
      pickupAddress
    } = formData;

    if (!fullName || !productName || !quantity || !destination || !date || !vehicleType || !pickupAddress) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSubmitted(true);

    emailjs.send(
      'service_irbq8y5',       // Your Service ID
      'template_6102nnh',      // Your Template ID
      formData,
      'wVdpMEGGzJqojcblV'      // Your Public Key
    )
      .then(() => {
        alert('✅ Application Submitted Successfully!');
        resetForm();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setError('❌ Failed to send application. Please try again.');
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1 pt-20">
        <Sidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
              Transport Logistic Application
            </h1>

            {error && <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Product Name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Quantity (kg) *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Destination *</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Pick-up Address *</label>
                <input
                  type="text"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Preferred Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Vehicle Type *</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="bakkie">Bakkie</option>
                  <option value="truck">Truck</option>
                  <option value="car">Car</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Add Note (Optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Any special instructions?"
                />
              </div>

              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                >
                  <Home size={18} /> Back to Home
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TransportLogisticForm;
