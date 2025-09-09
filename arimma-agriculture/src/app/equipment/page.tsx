'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EquipmentBookingForm from '../../components/EquipmentBookingForm';

interface Equipment {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  image: string;
  specifications: any;
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  availability: {
    status: string;
    nextAvailable: string;
    location: string;
  };
  features: string[];
  rating: number;
  reviews: number;
  cooperative: boolean;
  serviceModel: string;
}

interface Cooperative {
  id: string;
  name: string;
  location: string;
  members: number;
  equipment: string[];
  benefits: string[];
  membershipFee: number;
  discount: number;
}

interface ServiceModel {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  pricing: string;
  bestFor: string;
}

export default function EquipmentPage() {
  const { user } = useAuth();
  const [equipmentData, setEquipmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCooperative, setSelectedCooperative] = useState('all');
  const [selectedServiceModel, setSelectedServiceModel] = useState('all');
  const [activeTab, setActiveTab] = useState('equipment');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipmentData();
  }, [selectedType, selectedCooperative, selectedServiceModel]);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedCooperative !== 'all') params.append('cooperative', selectedCooperative);
      if (selectedServiceModel !== 'all') params.append('serviceModel', selectedServiceModel);

      const response = await fetch(`/api/equipment?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setEquipmentData(result.data);
      } else {
        setError(result.error || 'Failed to fetch equipment data');
      }
    } catch (err) {
      console.error('Equipment fetch error:', err);
      setError('Failed to fetch equipment data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Booked': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceModelColor = (model: string) => {
    switch (model) {
      case 'Pay-per-use': return 'bg-blue-100 text-blue-800';
      case 'Equipment-as-a-Service': return 'bg-purple-100 text-purple-800';
      case 'Cooperative Sharing': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = (bookingId: string) => {
    setShowBookingForm(false);
    setSelectedEquipment(null);
    setBookingSuccess(bookingId);
    // Clear success message after 5 seconds
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedEquipment(null);
  };

  const handleJoinCooperative = (cooperative: Cooperative) => {
    // In a real application, this would open a cooperative joining form
    alert(`Joining ${cooperative.name} - This would open the membership application`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading equipment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚜</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Equipment Unavailable</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchEquipmentData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!equipmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚜</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Equipment Data</h3>
          <p className="text-gray-500">Equipment data is not available at the moment.</p>
        </div>
      </div>
    );
  }

  const allEquipment = [...equipmentData.tractors, ...equipmentData.harvesters, ...equipmentData.drones];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go Back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Agricultural Equipment</h1>
              <p className="text-gray-600">Access tractors, harvesters, and drones on pay-per-use basis</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              title="Go to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Service Models Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Equipment Service Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipmentData.serviceModels.map((model: ServiceModel) => (
              <div key={model.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{model.name}</h3>
                <p className="text-gray-600 mb-4">{model.description}</p>
                <div className="space-y-2 mb-4">
                  {model.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Pricing:</strong> {model.pricing}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  <strong>Best for:</strong> {model.bestFor}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('equipment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'equipment'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Equipment ({allEquipment.length})
              </button>
              <button
                onClick={() => setActiveTab('cooperatives')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cooperatives'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Farmer Cooperatives ({equipmentData.cooperatives.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'equipment' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="tractor">Tractors</option>
                    <option value="harvester">Harvesters</option>
                    <option value="drone">Drones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooperative</label>
                  <select
                    value={selectedCooperative}
                    onChange={(e) => setSelectedCooperative(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Options</option>
                    <option value="true">Cooperative Available</option>
                    <option value="false">Individual Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Model</label>
                  <select
                    value={selectedServiceModel}
                    onChange={(e) => setSelectedServiceModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Models</option>
                    <option value="Pay-per-use">Pay-per-Use</option>
                    <option value="Equipment-as-a-Service">Equipment-as-a-Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEquipment.map((equipment: Equipment) => (
                <div key={equipment.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Equipment Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">
                        {equipment.type === 'tractor' ? '🚜' : 
                         equipment.type === 'harvester' ? '🌾' : '🚁'}
                      </div>
                      <p className="text-sm text-gray-600">{equipment.category}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{equipment.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.availability.status)}`}>
                        {equipment.availability.status}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{equipment.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{equipment.availability.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rating:</span>
                        <span className="font-medium flex items-center">
                          ⭐ {equipment.rating} ({equipment.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Service Model:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getServiceModelColor(equipment.serviceModel)}`}>
                          {equipment.serviceModel}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Pricing</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>Hourly:</span>
                          <span className="font-medium">{formatCurrency(equipment.pricing.hourly)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily:</span>
                          <span className="font-medium">{formatCurrency(equipment.pricing.daily)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekly:</span>
                          <span className="font-medium">{formatCurrency(equipment.pricing.weekly)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly:</span>
                          <span className="font-medium">{formatCurrency(equipment.pricing.monthly)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleBookEquipment(equipment)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Book Equipment
                      </button>
                      {equipment.cooperative && (
                        <button
                          onClick={() => alert('View cooperative options')}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Cooperatives
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'cooperatives' && (
          <div className="space-y-6">
            {equipmentData.cooperatives.map((cooperative: Cooperative) => (
              <div key={cooperative.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{cooperative.name}</h3>
                    <p className="text-gray-600 mb-2">{cooperative.location}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{cooperative.members} members</span>
                      <span>{cooperative.equipment.length} equipment items</span>
                      <span>{cooperative.discount}% discount</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(cooperative.membershipFee)}
                    </div>
                    <div className="text-sm text-gray-500">Annual membership</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cooperative.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleJoinCooperative(cooperative)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Join Cooperative
                  </button>
                  <button
                    onClick={() => alert('View cooperative details')}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date(equipmentData.lastUpdated).toLocaleString()}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedEquipment && (
        <EquipmentBookingForm
          equipment={selectedEquipment}
          onClose={handleCloseBookingForm}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Success Message */}
      {bookingSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <span className="text-xl mr-2">✅</span>
            <div>
              <div className="font-semibold">Booking Request Submitted!</div>
              <div className="text-sm text-green-100">Booking ID: {bookingSuccess}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
