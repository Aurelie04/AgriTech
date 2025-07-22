import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SolarFinancePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    customerType: 'homeowner',
    systemSize: '',
    financingOption: 'pay-as-you-go',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/solar-finance/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Solar Finance Program</h1>

        <p className="mb-4 text-gray-700">
          Arimma Energy offers flexible solar financing solutions designed to power homes and businesses with clean, affordable energy. Install solar systems with zero upfront costs and repay affordably over time.
        </p>

        <ul className="list-disc pl-5 mb-6 text-gray-700">
          <li><strong>Homeowners:</strong> Reduce bills with tailored solar packages and low monthly repayments.</li>
          <li><strong>Businesses:</strong> Cut costs with scalable solar systems and asset-backed finance.</li>
          <li><strong>Options:</strong> Choose pay-as-you-go or lease-to-own for wider access to clean energy.</li>
        </ul>

        {submitted ? (
          <div className="text-center text-green-700 font-semibold">
            ✅ Your application was submitted successfully!
            <br />
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <input
              name="address"
              type="text"
              placeholder="Address"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-600">Customer Type</label>
                <select
                  name="customerType"
                  value={form.customerType}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="homeowner">Homeowner</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm text-gray-600">Financing Option</label>
                <select
                  name="financingOption"
                  value={form.financingOption}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="pay-as-you-go">Pay-as-you-go</option>
                  <option value="lease-to-own">Lease-to-own</option>
                </select>
              </div>
            </div>

            <input
              name="systemSize"
              type="text"
              placeholder="Preferred System Size (kW)"
              value={form.systemSize}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              name="message"
              placeholder="Additional notes (optional)"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Apply for Solar Finance
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SolarFinancePage;
