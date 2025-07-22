import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DigitalMarket = () => {
  const [formData, setFormData] = useState({
    product_name: '',
    quantity: '',
    price: '',
    buyer_type: 'off-taker',
    contract_link: '',
    verified: false,
  });

  const [listings, setListings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const fetchListings = async () => {
    const res = await axios.get('http://localhost:8081/api/digital-market');
    setListings(res.data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, user_id: user?.id };
    await axios.post('http://localhost:8081/api/digital-market', payload);
    alert('Product listed in Digital Market!');
    setFormData({
      product_name: '',
      quantity: '',
      price: '',
      buyer_type: 'off-taker',
      contract_link: '',
      verified: false,
    });
    fetchListings();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Digital Market</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <h2 className="text-xl font-semibold">List Your Produce</h2>

        <input
          type="text"
          name="product_name"
          placeholder="Product Name"
          value={formData.product_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity (e.g., 100kg)"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (ZAR)"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select name="buyer_type" value={formData.buyer_type} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="off-taker">Off-taker</option>
          <option value="processor">Processor</option>
          <option value="export-buyer">Export Buyer</option>
        </select>
        <input
          type="text"
          name="contract_link"
          placeholder="Digital Contract Link (optional)"
          value={formData.contract_link}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} />
          <span>Verified Seller</span>
        </label>

        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" type="submit">
          List Product
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Recent Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((item) => (
          <div key={item.id} className="border p-4 rounded shadow bg-white">
            <h3 className="text-lg font-bold">{item.product_name}</h3>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Price:</strong> R{parseFloat(item.price).toFixed(2)}</p>
            <p><strong>Buyer Type:</strong> {item.buyer_type}</p>
            <p><strong>Verified:</strong> {item.verified ? 'Yes' : 'No'}</p>
            {item.contract_link && (
              <a href={item.contract_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View Contract
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalMarket;
