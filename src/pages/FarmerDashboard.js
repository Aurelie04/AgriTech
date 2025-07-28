// src/pages/FarmerDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Truck,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Apple,
  Wrench,
  Sun,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import WeatherForecast from '../components/WeatherForecast';

function FarmerDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('userData'); // ✅ fixed key

  if (!storedUser) {
    alert('Please log in to continue.');
    navigate('/login');
    return;
  }

  try {
    const parsed = JSON.parse(storedUser);
    setUserName(parsed.name || '');
  } catch (err) {
    console.error('Failed to parse userData:', err);
    localStorage.removeItem('userData');
    navigate('/login');
  }
  }, [navigate]);

  const [yieldData] = useState([
    { month: 'Jan', cropProduction: 1200, harvest: 950, revenue: 24000 },
    { month: 'Feb', cropProduction: 1350, harvest: 1000, revenue: 28000 },
    { month: 'Mar', cropProduction: 1500, harvest: 1100, revenue: 31000 },
    { month: 'Apr', cropProduction: 1600, harvest: 1200, revenue: 34000 },
    { month: 'May', cropProduction: 1700, harvest: 1300, revenue: 37000 },
    { month: 'Jun', cropProduction: 1800, harvest: 1450, revenue: 40000 },
  ]);

  const exchangeRate = 17.95;
  const formatZAR = (value) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const usdRevenue = (payload[1].value / exchangeRate).toFixed(2);
      return (
        <div className="bg-white border border-gray-300 p-2 rounded shadow">
          <p className="font-semibold">{label}</p>
          <p>Harvest: {payload[0].value} kg</p>
          <p>Revenue: {formatZAR(payload[1].value)} (≈ ${usdRevenue} USD)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between text-sm md:text-base">
      <Topbar />
      <div className="pt-24 px-4 md:px-8 space-y-10">
        <Sidebar />
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          {userName ? `Good day, ${userName} 👋` : 'Welcome back, Farmer 👨‍🌾'}
        </h1>

        <div className="flex flex-col lg:flex-row justify-center gap-6 items-start">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-3 text-center">Crop Production vs Revenue</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: 'Harvest (kg)', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" label={{ value: 'Revenue (ZAR)', angle: -90, position: 'insideRight' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="harvest" stroke="#38bdf8" strokeWidth={2} name="Harvest (kg)" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (ZAR)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <WeatherForecast />
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-6 items-start">
          <div className="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4 text-center"> Crop Production vs Harvest</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Quantity (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="harvest" fill="#38bdf8" name="Harvest (kg)" />
                <Bar dataKey="cropProduction" fill="#f59e0b" name="Crop Production (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 text-center">💱 Mid-Market Exchange Rate</h2>
            <table className="w-full text-center border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Currency</th>
                  <th className="border p-2">Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">USD to ZAR</td>
                  <td className="border p-2">1 USD = {exchangeRate} ZAR</td>
                </tr>
                <tr>
                  <td className="border p-2">ZAR to USD</td>
                  <td className="border p-2">1 ZAR = {(1 / exchangeRate).toFixed(4)} USD</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center mt-8">Facilities</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          <div onClick={() => navigate('/digital-marketplace')} className="cursor-pointer bg-green-100 text-green-800 rounded-lg shadow p-4 w-full text-center hover:bg-green-200 transition">
            <ShoppingCart className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-lg">Digital Marketplace</h3>
          </div>

          <div onClick={() => navigate('/transport-logistic')} className="cursor-pointer bg-blue-100 text-blue-800 rounded-lg shadow p-4 w-full text-center hover:bg-blue-200 transition">
            <Truck className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-lg">Transport Logistic</h3>
          </div>

          <Link to="/insurance/apply" className="cursor-pointer bg-red-100 text-red-800 rounded-lg shadow p-4 w-full text-center hover:bg-red-200 transition">
            <div className="text-2xl mb-2">❤️</div>
            <h3 className="font-bold text-lg">Agriculture Insurance</h3>
          </Link>

          <div onClick={() => navigate('/equipment')} className="cursor-pointer bg-purple-100 text-purple-800 rounded-lg shadow p-4 w-full text-center hover:bg-purple-200 transition">
            <Wrench className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-lg">Equipment Sharing & Mechanisation</h3>
          </div>

          <div onClick={() => navigate('/solar-finance')} className="cursor-pointer bg-yellow-100 text-yellow-800 rounded-lg shadow p-4 w-full text-center hover:bg-yellow-200 transition">
            <Sun className="mx-auto mb-2" size={32} />
            <h3 className="font-bold text-lg">Solar Finances</h3>
          </div>

          <div onClick={() => navigate('/smart-farming-tools')} className="cursor-pointer bg-emerald-100 text-emerald-800 rounded-lg shadow p-4 w-full text-center hover:bg-emerald-200 transition">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-bold text-lg">Smart Farming Tools</h3>
          </div>

          {/* ✅ Agri-Banking - updated navigation */}
          <div onClick={() => navigate('/agri-banking')} className="cursor-pointer bg-indigo-100 text-indigo-800 rounded-lg shadow p-4 w-full text-center hover:bg-indigo-200 transition">
            <div className="text-2xl mb-2">🏦</div>
            <h3 className="font-bold text-lg">Agri-Banking</h3>
          </div>

          <div onClick={() => navigate('/agricultural-finance')} className="cursor-pointer bg-amber-100 text-amber-800 rounded-lg shadow p-4 w-full text-center hover:bg-amber-200 transition">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-bold text-lg">Agricultural Finance</h3>
          </div>
        </div>
      </div>

      <footer className="bg-green-900 text-white py-10 mt-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">🌾 Arimma</h2>
            <p>Empowering agriculture through technology. We connect farmers with tools, insights, and the global market to boost productivity and income.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Follow us</h3>
            <div className="flex gap-4 text-white">
              <Facebook />
              <Instagram />
              <Linkedin />
              <Twitter />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Download App</h3>
            <div className="flex flex-col gap-2">
              <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
                <Apple size={18} /> iOS App
              </button>
              <button className="bg-black text-white px-4 py-2 rounded flex items-center gap-2">
                📱 Android App
              </button>
            </div>
          </div>
        </div>
        <p className="text-center mt-8 text-sm">&copy; {new Date().getFullYear()} Arimma. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FarmerDashboard;
