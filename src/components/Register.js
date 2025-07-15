// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    business: '',
    role: 'farmer' // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/api/register', form);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto mt-10 p-6 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-semibold text-center">Register</h2>

      <input name="name" placeholder="Name" required value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="business" placeholder="Business" value={form.business} onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="role" placeholder="Role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded" />

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Register
      </button>

      <p className="text-center mt-2">
        Already have an account? <a href="/login" className="text-green-600">Login</a>
      </p>
    </form>
  );
}

export default Register;
