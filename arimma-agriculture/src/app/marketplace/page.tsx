'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface VerifiedBuyer {
  id: number;
  company_name: string;
  business_type: string;
  category_name: string;
  category_icon: string;
  verification_status: string;
  contact_person: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  annual_volume: number;
  payment_terms: string;
  quality_requirements: string;
  preferred_products: string[];
  certifications: string[];
}

interface MarketplaceListing {
  id: number;
  product_name: string;
  product_type: string;
  variety: string;
  description: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  currency: string;
  quality_grade: string;
  organic: boolean;
  certified: boolean;
  location: string;
  minimum_order: number;
  delivery_available: boolean;
  views_count: number;
  inquiries_count: number;
  created_at: string;
  seller_email: string;
  seller_business: string;
  seller_city: string;
}

interface PriceAnalytics {
  product_type: string;
  variety: string;
  location: string;
  quality_grade: string;
  organic: boolean;
  avg_price: number;
  min_price: number;
  max_price: number;
  price_points: number;
  latest_price_date: string;
}

const BUYER_TYPES = {
  'off_taker': 'Off-Taker',
  'processor': 'Processor',
  'export_buyer': 'Export Buyer',
  'retailer': 'Retailer',
  'wholesaler': 'Wholesaler'
};

const QUALITY_GRADES = {
  'premium': 'Premium',
  'standard': 'Standard',
  'commercial': 'Commercial'
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'buyers' | 'listings' | 'analytics'>('buyers');
  const [buyers, setBuyers] = useState<VerifiedBuyer[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [analytics, setAnalytics] = useState<PriceAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [showListingForm, setShowListingForm] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    businessType: '',
    productType: '',
    qualityGrade: '',
    organic: false,
    location: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockBuyers: VerifiedBuyer[] = [
        {
          id: 1,
          company_name: 'Fresh Foods Ltd',
          business_type: 'processor',
          category_name: 'Food Processors',
          category_icon: '🏭',
          verification_status: 'verified',
          contact_person: 'John Smith',
          phone: '+27 11 123 4567',
          email: 'procurement@freshfoods.co.za',
          city: 'Johannesburg',
          state: 'Gauteng',
          annual_volume: 50000000,
          payment_terms: '30 days',
          quality_requirements: 'Grade A, Organic preferred',
          preferred_products: ['Tomatoes', 'Onions', 'Carrots'],
          certifications: ['HACCP', 'ISO 22000']
        },
        {
          id: 2,
          company_name: 'Export Partners SA',
          business_type: 'export_buyer',
          category_name: 'Export Companies',
          category_icon: '🌍',
          verification_status: 'verified',
          contact_person: 'Sarah Johnson',
          phone: '+27 21 987 6543',
          email: 'buying@exportpartners.co.za',
          city: 'Cape Town',
          state: 'Western Cape',
          annual_volume: 100000000,
          payment_terms: 'Advance payment',
          quality_requirements: 'Export grade, EU standards',
          preferred_products: ['Citrus', 'Grapes', 'Avocados'],
          certifications: ['GlobalGAP', 'BRC', 'SEDEX']
        },
        {
          id: 3,
          company_name: 'Green Grocers Chain',
          business_type: 'retailer',
          category_name: 'Retail Chains',
          category_icon: '🏪',
          verification_status: 'verified',
          contact_person: 'Mike Brown',
          phone: '+27 31 555 1234',
          email: 'supply@greengrocers.co.za',
          city: 'Durban',
          state: 'KwaZulu-Natal',
          annual_volume: 75000000,
          payment_terms: '14 days',
          quality_requirements: 'Fresh, consistent quality',
          preferred_products: ['Leafy Greens', 'Herbs', 'Berries'],
          certifications: ['Organic', 'Fair Trade']
        }
      ];

      const mockListings: MarketplaceListing[] = [
        {
          id: 1,
          product_name: 'Premium Tomatoes',
          product_type: 'Vegetables',
          variety: 'Cherry',
          description: 'Fresh, organic cherry tomatoes from our greenhouse',
          quantity: 1000,
          unit: 'kg',
          price_per_unit: 25.50,
          currency: 'ZAR',
          quality_grade: 'premium',
          organic: true,
          certified: true,
          location: 'Limpopo',
          minimum_order: 50,
          delivery_available: true,
          views_count: 45,
          inquiries_count: 8,
          created_at: '2025-01-15',
          seller_email: 'farmer@example.com',
          seller_business: 'Green Valley Farms',
          seller_city: 'Polokwane'
        },
        {
          id: 2,
          product_name: 'Sweet Corn',
          product_type: 'Grains',
          variety: 'Yellow',
          description: 'Fresh sweet corn, perfect for processing',
          quantity: 5000,
          unit: 'kg',
          price_per_unit: 8.75,
          currency: 'ZAR',
          quality_grade: 'standard',
          organic: false,
          certified: false,
          location: 'Free State',
          minimum_order: 200,
          delivery_available: false,
          views_count: 32,
          inquiries_count: 5,
          created_at: '2025-01-20',
          seller_email: 'corn@example.com',
          seller_business: 'Golden Fields',
          seller_city: 'Bloemfontein'
        }
      ];

      const mockAnalytics: PriceAnalytics[] = [
        {
          product_type: 'Vegetables',
          variety: 'Tomatoes',
          location: 'Limpopo',
          quality_grade: 'premium',
          organic: true,
          avg_price: 24.50,
          min_price: 20.00,
          max_price: 28.00,
          price_points: 15,
          latest_price_date: '2025-01-20'
        },
        {
          product_type: 'Grains',
          variety: 'Maize',
          location: 'Free State',
          quality_grade: 'standard',
          organic: false,
          avg_price: 8.25,
          min_price: 7.50,
          max_price: 9.00,
          price_points: 22,
          latest_price_date: '2025-01-19'
        }
      ];

      setBuyers(mockBuyers);
      setListings(mockListings);
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(volume);
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✓ Verified</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">⏳ Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">✗ Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unknown</span>;
    }
  };

  const getQualityBadge = (grade: string) => {
    switch (grade) {
      case 'premium':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">Premium</span>;
      case 'standard':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Standard</span>;
      case 'commercial':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Commercial</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Standard</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
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
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                ← Back to Dashboard
              </button>
              {user?.role === 'farmer' && (
                <button
                  onClick={() => setShowListingForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  List Your Produce
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Marketplace</h1>
          <p className="text-gray-600 mb-4">
            Connect with verified buyers, processors, and export companies. Sell your produce with digital contracts and dynamic pricing.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('buyers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'buyers'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Verified Buyers
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'listings'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Produce Listings
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Price Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {activeTab === 'buyers' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  value={filters.businessType}
                  onChange={(e) => setFilters({...filters, businessType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Types</option>
                  <option value="off_taker">Off-Taker</option>
                  <option value="processor">Processor</option>
                  <option value="export_buyer">Export Buyer</option>
                  <option value="retailer">Retailer</option>
                  <option value="wholesaler">Wholesaler</option>
                </select>
              </div>
            )}
            {activeTab === 'listings' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <select
                    value={filters.productType}
                    onChange={(e) => setFilters({...filters, productType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Types</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Herbs">Herbs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
                  <select
                    value={filters.qualityGrade}
                    onChange={(e) => setFilters({...filters, qualityGrade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">All Grades</option>
                    <option value="premium">Premium</option>
                    <option value="standard">Standard</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                placeholder="City, Province"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.organic}
                  onChange={(e) => setFilters({...filters, organic: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Organic Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'buyers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((buyer) => (
              <div key={buyer.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{buyer.category_icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{buyer.company_name}</h3>
                      <p className="text-sm text-gray-600">{BUYER_TYPES[buyer.business_type as keyof typeof BUYER_TYPES]}</p>
                    </div>
                  </div>
                  {getVerificationBadge(buyer.verification_status)}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-medium">{buyer.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{buyer.city}, {buyer.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Volume</p>
                    <p className="font-medium">{formatVolume(buyer.annual_volume)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Terms</p>
                    <p className="font-medium">{buyer.payment_terms}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Preferred Products</p>
                  <div className="flex flex-wrap gap-1">
                    {buyer.preferred_products.map((product, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {buyer.certifications.map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm">
                    Contact Buyer
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="space-y-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">🌱</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{listing.product_name}</h3>
                      <p className="text-sm text-gray-600">{listing.variety} • {listing.product_type}</p>
                      <p className="text-sm text-gray-500">by {listing.seller_business} • {listing.seller_city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{formatPrice(listing.price_per_unit)}/{listing.unit}</p>
                    <p className="text-sm text-gray-600">{listing.quantity} {listing.unit} available</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Quality Grade</p>
                    <div className="mt-1">{getQualityBadge(listing.quality_grade)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{listing.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Minimum Order</p>
                    <p className="font-medium">{listing.minimum_order} {listing.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery</p>
                    <p className="font-medium">{listing.delivery_available ? 'Available' : 'Not Available'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-4">
                    {listing.organic && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">🌱 Organic</span>}
                    {listing.certified && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">✓ Certified</span>}
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>👁️ {listing.views_count} views</span>
                    <span>💬 {listing.inquiries_count} inquiries</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{listing.description}</p>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Make Inquiry
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    Create Contract
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Analytics (Last 30 Days)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Points</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.product_type}</div>
                            <div className="text-sm text-gray-500">{item.variety}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getQualityBadge(item.quality_grade)}
                            {item.organic && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">🌱</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(item.avg_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(item.min_price)} - {formatPrice(item.max_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price_points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'buyers' && buyers.length === 0) || 
          (activeTab === 'listings' && listings.length === 0) || 
          (activeTab === 'analytics' && analytics.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'buyers' && "No verified buyers found matching your criteria."}
              {activeTab === 'listings' && "No produce listings found matching your criteria."}
              {activeTab === 'analytics' && "No price analytics data available."}
            </p>
          </div>
        )}
      </main>

      {/* Add Listing Form Modal */}
      {showListingForm && (
        <AddListingForm 
          onClose={() => setShowListingForm(false)}
          onSuccess={() => {
            setShowListingForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Add Listing Form Component
function AddListingForm({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    variety: '',
    description: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    qualityGrade: 'standard',
    organic: false,
    certified: false,
    location: '',
    minimumOrder: '',
    deliveryAvailable: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, we'll just simulate adding a listing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Listing created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">List Your Produce</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Premium Tomatoes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
              <select
                value={formData.productType}
                onChange={(e) => setFormData({...formData, productType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Type</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Grains</option>
                <option value="Herbs">Herbs</option>
                <option value="Spices">Spices</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({...formData, variety: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Cherry, Sweet Corn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
              <select
                value={formData.qualityGrade}
                onChange={(e) => setFormData({...formData, qualityGrade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="premium">Premium</option>
                <option value="standard">Standard</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Describe your produce, growing methods, quality, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="kg">kg</option>
                <option value="tons">tons</option>
                <option value="pieces">pieces</option>
                <option value="boxes">boxes</option>
                <option value="crates">crates</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (ZAR) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="25.50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Limpopo, Free State"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order</label>
              <input
                type="number"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({...formData, minimumOrder: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.organic}
                onChange={(e) => setFormData({...formData, organic: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Organic</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.certified}
                onChange={(e) => setFormData({...formData, certified: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Certified</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.deliveryAvailable}
                onChange={(e) => setFormData({...formData, deliveryAvailable: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Delivery Available</span>
            </label>
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
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

