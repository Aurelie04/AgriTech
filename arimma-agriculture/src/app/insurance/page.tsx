'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface InsuranceProduct {
  id: number;
  name: string;
  description: string;
  coverage_type: string;
  premium_rate: number;
  coverage_amount: number;
  deductible: number;
  policy_term_months: number;
  category_name: string;
}

interface InsuranceBundle {
  id: number;
  name: string;
  description: string;
  discount_percentage: number;
  products: any[];
}

export default function InsurancePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [bundles, setBundles] = useState<InsuranceBundle[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchBundles();
  }, [selectedType]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedType) params.append('type', selectedType);
      
      const response = await fetch(`/api/insurance/products?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBundles = async () => {
    try {
      const response = await fetch('/api/insurance/bundles');
      const data = await response.json();
      setBundles(data.bundles || []);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = async (productId: number) => {
    if (!user) {
      alert('Please login to request a quote');
      return;
    }

    setShowRequestForm(true);
  };

  const getCoverageTypeIcon = (type: string) => {
    switch (type) {
      case 'crop': return '🌱';
      case 'asset': return '🚜';
      case 'weather_indexed': return '🌤️';
      case 'bundled': return '📦';
      default: return '🛡️';
    }
  };

  const getCoverageTypeColor = (type: string) => {
    switch (type) {
      case 'crop': return 'bg-green-100 text-green-800';
      case 'asset': return 'bg-blue-100 text-blue-800';
      case 'weather_indexed': return 'bg-yellow-100 text-yellow-800';
      case 'bundled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insurance products...</p>
        </div>
      </div>
    );
  }

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
                className="h-16 w-auto"
              />
            </div>
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                Dashboard
              </a>
              <button
                onClick={() => setShowRequestForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agricultural Insurance Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Protect your farm with comprehensive insurance coverage including crop, asset, 
            and weather-indexed protection. All requests are handled by our expert team.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setSelectedType('')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedType === '' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setSelectedType('crop')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedType === 'crop' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              🌱 Crop Insurance
            </button>
            <button
              onClick={() => setSelectedType('asset')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedType === 'asset' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              🚜 Asset Insurance
            </button>
            <button
              onClick={() => setSelectedType('weather_indexed')}
              className={`px-6 py-2 rounded-md transition-colors ${
                selectedType === 'weather_indexed' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              🌤️ Weather Indexed
            </button>
          </div>
        </div>

        {/* Bundled Packages Section */}
        {bundles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bundled Insurance Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="bg-white rounded-lg shadow-sm border-2 border-purple-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{bundle.name}</h3>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {bundle.discount_percentage}% OFF
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{bundle.description}</p>
                  <div className="space-y-2 mb-6">
                    {bundle.products.map((product: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span>{getCoverageTypeIcon(product.type)}</span>
                        <span className="text-sm text-gray-700">{product.name}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleRequestQuote(bundle.id)}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Get Bundle Quote
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Insurance Products` : 'All Insurance Products'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCoverageTypeIcon(product.coverage_type)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCoverageTypeColor(product.coverage_type)}`}>
                      {product.category_name}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Coverage Amount:</span>
                    <span className="text-sm font-medium">R{product.coverage_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Premium Rate:</span>
                    <span className="text-sm font-medium">{(product.premium_rate * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Deductible:</span>
                    <span className="text-sm font-medium">R{product.deductible.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Policy Term:</span>
                    <span className="text-sm font-medium">{product.policy_term_months} months</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRequestQuote(product.id)}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Choosing the Right Coverage?
          </h3>
          <p className="text-gray-600 mb-4">
            Our insurance experts are here to help you find the perfect coverage for your agricultural needs.
          </p>
          <p className="text-sm text-gray-500">
            All insurance requests are sent to: <strong>gabrielnana084@gmail.com</strong>
          </p>
        </div>
      </main>

      {/* Request Form Modal */}
      {showRequestForm && (
        <InsuranceRequestForm 
          onClose={() => setShowRequestForm(false)}
          productId={null}
        />
      )}
    </div>
  );
}

// Insurance Request Form Component
function InsuranceRequestForm({ onClose, productId }: { onClose: () => void; productId: number | null }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    requestType: 'quote',
    subject: '',
    message: '',
    contactEmail: user?.email || '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/insurance/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          ...formData
        }),
      });

      if (response.ok) {
        alert('Your insurance request has been submitted successfully! Our team will contact you soon.');
        onClose();
      } else {
        alert('Error submitting request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Request Insurance Quote</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
            <select
              value={formData.requestType}
              onChange={(e) => setFormData({...formData, requestType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="quote">Insurance Quote</option>
              <option value="claim">File a Claim</option>
              <option value="policy_update">Policy Update</option>
              <option value="general_inquiry">General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Brief description of your request"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={4}
              placeholder="Please provide details about your insurance needs..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
