import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import FarmerDashboard from './pages/FarmerDashboard';
import Register from './components/Register';
import Login from './components/Login';
import TransportLogisticForm from './pages/TransportLogistic';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EquipmentList from './pages/EquipmentList';
import BookEquipment from './pages/BookEquipment';
import Profile from './pages/Profile';
import AgricultureInsurance from './pages/AgricultureInsurance';
import DigitalMarket from './pages/DigitalMarket';
import SolarFinancePage from './components/SolarFinancePage';



function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/transport-logistic" element={<TransportLogisticForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/equipment/:equipmentType" element={<BookEquipment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/agriculture-insurance" element={<AgricultureInsurance />} />
        <Route path="/digital-marketplace" element={<DigitalMarket />} />
        <Route path="/solar-finance" element={<SolarFinancePage />} />

        {/* Catch-all route for 404s */}
        <Route path="*" element={<div className="p-4 text-center text-red-600">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
