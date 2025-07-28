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
import DigitalMarket from './pages/DigitalMarket';
import SolarFinancePage from './components/SolarFinancePage';
import WeatherForecast from './components/WeatherForecast';
import AgriBankingPage from './pages/AgriBankingPage';
import AgriInsurancePage from './pages/AgriInsurancePage';
import InsuranceClaimsPage from './pages/InsuranceClaimsPage';
import AgriculturalFinancePage from './pages/AgriculturalFinancePage';

// ✅ PrivateRoute Component (auth check)
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userData'));
  return user && user.id ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <FarmerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/transport-logistic"
          element={
            <PrivateRoute>
              <TransportLogisticForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipment"
          element={
            <PrivateRoute>
              <EquipmentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/equipment/:equipmentType"
          element={
            <PrivateRoute>
              <BookEquipment />
            </PrivateRoute>
          }
        />
        <Route
          path="/digital-marketplace"
          element={
            <PrivateRoute>
              <DigitalMarket />
            </PrivateRoute>
          }
        />
        <Route
          path="/solar-finance"
          element={
            <PrivateRoute>
              <SolarFinancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <PrivateRoute>
              <WeatherForecast />
            </PrivateRoute>
          }
        />
        <Route
          path="/agri-banking"
          element={
            <PrivateRoute>
              <AgriBankingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/insurance/apply"
          element={
            <PrivateRoute>
              <AgriInsurancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/insurance/claims"
          element={
            <PrivateRoute>
              <InsuranceClaimsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/agricultural-finance"
          element={
            <PrivateRoute>
              <AgriculturalFinancePage />
            </PrivateRoute>
          }
        />

        {/* Catch-all for 404s */}
        <Route
          path="*"
          element={<div className="p-4 text-center text-red-600">404 - Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
