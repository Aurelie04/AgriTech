'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const getInsuranceQuickActions = (role: string) => {
    const actions = {
      farmer: [
        { name: 'Crop Insurance', icon: '🌱', description: 'Protect your crops from weather and pests', href: '/insurance' },
        { name: 'Equipment Insurance', icon: '🚜', description: 'Cover your farm machinery and tools', href: '/insurance' },
        { name: 'File Claim', icon: '📋', description: 'Submit insurance claims quickly', href: '/insurance/claims' }
      ],
      buyer: [
        { name: 'Asset Insurance', icon: '🏭', description: 'Protect your storage and processing facilities', href: '/insurance' },
        { name: 'Liability Coverage', icon: '🛡️', description: 'Comprehensive business protection', href: '/insurance' }
      ],
      trader: [
        { name: 'Portfolio Insurance', icon: '💼', description: 'Protect your trading investments', href: '/insurance' },
        { name: 'Market Risk Coverage', icon: '📈', description: 'Weather and price index protection', href: '/insurance' }
      ],
      financier: [
        { name: 'Loan Protection', icon: '💰', description: 'Insure agricultural loans and investments', href: '/insurance' },
        { name: 'Risk Assessment', icon: '⚠️', description: 'Evaluate insurance needs for clients', href: '/insurance' }
      ],
      logistics: [
        { name: 'Fleet Insurance', icon: '🚛', description: 'Cover your transportation vehicles', href: '/insurance' },
        { name: 'Cargo Protection', icon: '📦', description: 'Insure goods in transit', href: '/insurance' }
      ]
    };
    return actions[role as keyof typeof actions] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="hidden lg:block">
                  <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1"
                  title="Go to Home Page"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="hidden sm:block">Home</span>
                </button>
                <span className="text-gray-700 hidden sm:block">Welcome, {user.profile?.first_name || user.email}</span>
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
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="text-gray-600 mb-4">Browse, search, and manage your agricultural products</p>
                <a 
                  href="/farm-management"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Manage Products
                </a>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Tracking</h3>
                <p className="text-gray-600 mb-4">Monitor crop growth and health</p>
                <button 
                  onClick={() => router.push('/crop-tracking')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Track Crops
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather Forecast</h3>
                <p className="text-gray-600 mb-4">Get 7-day weather predictions for your location</p>
                <button 
                  onClick={() => router.push('/weather')}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors"
                >
                  View Weather
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment</h3>
                <p className="text-gray-600 mb-4">Access tractors, harvesters, and drones</p>
                <button 
                  onClick={() => router.push('/equipment')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Book Equipment
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Finance</h3>
                <p className="text-gray-600 mb-4">Access loans and working capital</p>
                <button 
                  onClick={() => router.push('/finance')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply for Loan
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplace</h3>
                <p className="text-gray-600 mb-4">Sell your products to buyers</p>
                <button 
                  onClick={() => router.push('/marketplace')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
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

        {/* Insurance Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Insurance Protection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getInsuranceQuickActions(user.role).map((action, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{action.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{action.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <a 
                  href={action.href}
                  className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Get Started
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
          
          {/* Insurance Contact Info */}
          <div className="mt-6 bg-green-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">📧</span>
              <h3 className="text-lg font-semibold text-gray-900">Need Help with Insurance?</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Our insurance experts are available to help you choose the right coverage for your agricultural needs.
            </p>
            <p className="text-sm text-gray-500">
              All insurance requests are sent to: <strong>gabrielnana084@gmail.com</strong>
            </p>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
