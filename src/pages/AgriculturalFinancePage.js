import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AgriculturalFinancePage = () => {
  const [formData, setFormData] = useState({
    userId: '',
    accountType: '',
    diasporaWalletFor: '',
    amount: '',
    transactionReference: '',
  });

  const [userName, setUserName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || '');
        setFormData((prev) => ({
          ...prev,
          userId: parsed._id || '',
        }));
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:8081/api/agri-banking/submit', formData);

      setSuccessMessage(response.data.message || 'Application submitted successfully!');
      setFormData({
        userId: formData.userId,
        accountType: '',
        diasporaWalletFor: '',
        amount: '',
        transactionReference: '',
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 pt-24 max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center text-green-700">
              Apply for Agricultural Finance
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">Select Type</option>
                  <option value="Savings">Savings</option>
                  <option value="Credit">Credit</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Diaspora Wallet For</label>
                <input
                  type="text"
                  name="diasporaWalletFor"
                  value={formData.diasporaWalletFor}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Transaction Reference</label>
                <input
                  type="text"
                  name="transactionReference"
                  value={formData.transactionReference}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Submit Application
              </button>

              {successMessage && (
                <p className="text-green-600 mt-4 text-center">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-600 mt-4 text-center">{errorMessage}</p>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgriculturalFinancePage;
