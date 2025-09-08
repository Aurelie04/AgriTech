'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      farmer: 'Manage your farm operations, track crops, and connect with buyers',
      buyer: 'Discover quality agricultural products and connect with farmers',
      trader: 'Trade agricultural commodities and manage market operations',
      financier: 'Provide financial services and manage agricultural investments',
      logistics: 'Handle transportation and storage of agricultural goods'
    };
    return descriptions[role as keyof typeof descriptions] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/arimma-logo.svg" 
                alt="Arimma Agriculture Logo" 
                className="h-24 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.profile?.first_name || user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {getRoleDisplayName(user.role)} Dashboard
          </h2>
          <p className="text-gray-600">{getRoleDescription(user.role)}</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">{getRoleDisplayName(user.role)}</p>
            </div>
            {user.profile?.first_name && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.profile.first_name} {user.profile.last_name}
                </p>
              </div>
            )}
            {user.profile?.business_name && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Business</label>
                <p className="mt-1 text-sm text-gray-900">{user.profile.business_name}</p>
              </div>
            )}
            {user.profile?.city && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user.profile.city}, {user.profile.state}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Role-specific Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.role === 'farmer' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Farm Management</h3>
                <p className="text-gray-600 mb-4">Manage your farm operations and track crop progress</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Farms
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Tracking</h3>
                <p className="text-gray-600 mb-4">Monitor crop growth and health</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Track Crops
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplace</h3>
                <p className="text-gray-600 mb-4">Sell your products to buyers</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  List Products
                </button>
              </div>
            </>
          )}

          {user.role === 'buyer' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Catalog</h3>
                <p className="text-gray-600 mb-4">Browse available agricultural products</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Browse Products
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
                <p className="text-gray-600 mb-4">Manage your purchase orders</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Orders
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Suppliers</h3>
                <p className="text-gray-600 mb-4">Connect with reliable farmers</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Find Suppliers
                </button>
              </div>
            </>
          )}

          {user.role === 'trader' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Prices</h3>
                <p className="text-gray-600 mb-4">Track commodity prices and trends</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Prices
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trading Platform</h3>
                <p className="text-gray-600 mb-4">Execute trades and manage positions</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Start Trading
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600 mb-4">Market analysis and insights</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Analytics
                </button>
              </div>
            </>
          )}

          {user.role === 'financier' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loan Applications</h3>
                <p className="text-gray-600 mb-4">Review and process loan requests</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Review Applications
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio</h3>
                <p className="text-gray-600 mb-4">Manage your agricultural investments</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Portfolio
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                <p className="text-gray-600 mb-4">Evaluate agricultural investment risks</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Assess Risk
                </button>
              </div>
            </>
          )}

          {user.role === 'logistics' && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fleet Management</h3>
                <p className="text-gray-600 mb-4">Manage your transportation fleet</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Manage Fleet
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Orders</h3>
                <p className="text-gray-600 mb-4">Handle delivery requests and tracking</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  View Orders
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Storage Facilities</h3>
                <p className="text-gray-600 mb-4">Manage storage and warehousing</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Manage Storage
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
