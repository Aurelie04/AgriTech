// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FarmerDashboard from './pages/FarmerDashboard';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />

        {/* Optional: Forgot Password Placeholder */}
        <Route path="/forgot-password" element={<div className="p-4 text-center">Forgot Password Page</div>} />

        {/* Catch-all route for 404s */}
        <Route path="*" element={<div className="p-4 text-center text-red-600">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
