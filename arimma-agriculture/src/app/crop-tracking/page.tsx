'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Crop {
  id: number;
  name: string;
  variety: string;
  planting_date: string;
  expected_harvest: string;
  field_location: string;
  area_hectares: number;
  current_stage: string;
  progress_percentage: number;
  notes: string;
  created_at: string;
}

const CROP_STAGES = [
  { name: 'Planting', percentage: 0, color: 'bg-gray-500', icon: '🌱' },
  { name: 'Germination', percentage: 15, color: 'bg-yellow-500', icon: '🌿' },
  { name: 'Vegetative', percentage: 30, color: 'bg-green-500', icon: '🌿' },
  { name: 'Flowering', percentage: 60, color: 'bg-blue-500', icon: '🌸' },
  { name: 'Fruiting', percentage: 80, color: 'bg-orange-500', icon: '🍅' },
  { name: 'Harvest', percentage: 100, color: 'bg-red-500', icon: '🌾' }
];

export default function CropTrackingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCrops();
  }, [user, router]);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since we don't have a backend API yet
      const mockCrops: Crop[] = [
        {
          id: 1,
          name: 'Tomatoes',
          variety: 'Cherry',
          planting_date: '2025-01-15',
          expected_harvest: '2025-04-15',
          field_location: 'Field A - North Section',
          area_hectares: 2.5,
          current_stage: 'Flowering',
          progress_percentage: 65,
          notes: 'Good growth, regular watering maintained',
          created_at: '2025-01-15'
        },
        {
          id: 2,
          name: 'Maize',
          variety: 'Sweet Corn',
          planting_date: '2025-01-20',
          expected_harvest: '2025-05-20',
          field_location: 'Field B - East Section',
          area_hectares: 5.0,
          current_stage: 'Vegetative',
          progress_percentage: 35,
          notes: 'Strong growth, monitoring for pests',
          created_at: '2025-01-20'
        }
      ];
      setCrops(mockCrops);
    } catch (error) {
      console.error('Error fetching crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStageInfo = (stageName: string) => {
    return CROP_STAGES.find(stage => stage.name === stageName) || CROP_STAGES[0];
  };

  const getDaysToHarvest = (expectedHarvest: string) => {
    const today = new Date();
    const harvestDate = new Date(expectedHarvest);
    const diffTime = harvestDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crop data...</p>
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
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Add New Crop
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Crop Tracking</h1>
          <p className="text-gray-600 mb-4">
            Monitor your crops' growth stages, track progress, and manage your farming operations.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Crops</p>
                <p className="text-2xl font-bold text-gray-900">{crops.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.reduce((sum, crop) => sum + crop.area_hectares, 0).toFixed(1)} ha
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.length > 0 ? Math.round(crops.reduce((sum, crop) => sum + crop.progress_percentage, 0) / crops.length) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🌾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready for Harvest</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crops.filter(crop => crop.progress_percentage >= 90).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Crops List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Crops</h2>
          </div>
          
          {crops.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Crops Tracked Yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your crops to monitor their growth and manage your farming operations.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Add Your First Crop
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {crops.map((crop) => {
                const stageInfo = getStageInfo(crop.current_stage);
                const daysToHarvest = getDaysToHarvest(crop.expected_harvest);
                
                return (
                  <div key={crop.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{stageInfo.icon}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                          <p className="text-sm text-gray-600">{crop.variety} • {crop.field_location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Area: {crop.area_hectares} ha</p>
                        <p className="text-sm text-gray-600">Planted: {formatDate(crop.planting_date)}</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Growth Progress</span>
                        <span className="text-sm text-gray-600">{crop.progress_percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${stageInfo.color}`}
                          style={{ width: `${crop.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Stage and Harvest Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Stage</p>
                        <p className="font-medium text-gray-900">{crop.current_stage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expected Harvest</p>
                        <p className="font-medium text-gray-900">{formatDate(crop.expected_harvest)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days to Harvest</p>
                        <p className={`font-medium ${daysToHarvest <= 30 ? 'text-red-600' : 'text-gray-900'}`}>
                          {daysToHarvest > 0 ? `${daysToHarvest} days` : 'Ready!'}
                        </p>
                      </div>
                    </div>
                    
                    {crop.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notes:</span> {crop.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Add Crop Form Modal */}
      {showAddForm && (
        <AddCropForm 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchCrops();
          }}
        />
      )}
    </div>
  );
}

// Add Crop Form Component
function AddCropForm({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    variety: '',
    plantingDate: '',
    expectedHarvest: '',
    fieldLocation: '',
    areaHectares: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, we'll just simulate adding a crop
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Crop added successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error adding crop:', error);
      alert('Error adding crop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Add New Crop</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Tomatoes, Maize, Wheat"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Variety *</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({...formData, variety: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Cherry, Sweet Corn, Durum"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date *</label>
              <input
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Harvest Date *</label>
              <input
                type="date"
                value={formData.expectedHarvest}
                onChange={(e) => setFormData({...formData, expectedHarvest: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field Location *</label>
              <input
                type="text"
                value={formData.fieldLocation}
                onChange={(e) => setFormData({...formData, fieldLocation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Field A - North Section"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (Hectares) *</label>
              <input
                type="number"
                step="0.1"
                value={formData.areaHectares}
                onChange={(e) => setFormData({...formData, areaHectares: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 2.5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Any additional notes about this crop..."
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
              {loading ? 'Adding...' : 'Add Crop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



