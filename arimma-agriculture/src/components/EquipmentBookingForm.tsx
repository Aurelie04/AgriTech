'use client';

import { useState } from 'react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  category: string;
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  availability: {
    location: string;
  };
  serviceModel: string;
}

interface BookingFormProps {
  equipment: Equipment;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export default function EquipmentBookingForm({ equipment, onClose, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    farmerName: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    startDate: '',
    endDate: '',
    preferredTime: '',
    rateType: 'daily',
    paymentMethod: 'bank_transfer',
    specialRequirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalCost = () => {
    const rate = equipment.pricing[formData.rateType as keyof typeof equipment.pricing];
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 0;
    }
    
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (formData.rateType === 'hourly') {
      return rate * 8 * daysDiff; // Assuming 8 hours per day
    } else if (formData.rateType === 'daily') {
      return rate * daysDiff;
    } else if (formData.rateType === 'weekly') {
      return rate * Math.ceil(daysDiff / 7);
    } else if (formData.rateType === 'monthly') {
      return rate * Math.ceil(daysDiff / 30);
    }
    
    return 0;
  };

  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return '';
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff === 1) return '1 day';
    if (daysDiff < 7) return `${daysDiff} days`;
    if (daysDiff < 30) return `${Math.ceil(daysDiff / 7)} weeks`;
    return `${Math.ceil(daysDiff / 30)} months`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.farmerName || !formData.email || !formData.phone || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const totalCost = calculateTotalCost();
      const duration = getDuration();
      
      const bookingData = {
        bookingId: `EQ-${Date.now()}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        equipmentType: equipment.category,
        equipmentLocation: equipment.availability.location,
        serviceModel: equipment.serviceModel,
        farmerName: formData.farmerName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        farmSize: formData.farmSize,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: duration,
        preferredTime: formData.preferredTime,
        rateType: formData.rateType,
        rate: formatCurrency(equipment.pricing[formData.rateType as keyof typeof equipment.pricing]),
        totalCost: formatCurrency(totalCost),
        paymentMethod: formData.paymentMethod,
        specialRequirements: formData.specialRequirements
      };

      const response = await fetch('/api/equipment/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.bookingId);
      } else {
        setError(result.error || 'Failed to submit booking request');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError('Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Equipment</h2>
              <p className="text-green-100">{equipment.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Equipment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Equipment Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{equipment.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 font-medium">{equipment.availability.location}</span>
              </div>
              <div>
                <span className="text-gray-600">Service Model:</span>
                <span className="ml-2 font-medium">{equipment.serviceModel}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium text-green-600">Available</span>
              </div>
            </div>
          </div>

          {/* Farmer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Farmer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City, Province"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Size (hectares)
                </label>
                <input
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 50"
                />
              </div>
            </div>
          </div>

          {/* Booking Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select preferred time</option>
                  <option value="early_morning">Early Morning (6:00 - 8:00)</option>
                  <option value="morning">Morning (8:00 - 12:00)</option>
                  <option value="afternoon">Afternoon (12:00 - 16:00)</option>
                  <option value="late_afternoon">Late Afternoon (16:00 - 18:00)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate Type
                </label>
                <select
                  name="rateType"
                  value={formData.rateType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly ({formatCurrency(equipment.pricing.hourly)}/hour)</option>
                  <option value="daily">Daily ({formatCurrency(equipment.pricing.daily)}/day)</option>
                  <option value="weekly">Weekly ({formatCurrency(equipment.pricing.weekly)}/week)</option>
                  <option value="monthly">Monthly ({formatCurrency(equipment.pricing.monthly)}/month)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash on Delivery</option>
                  <option value="mobile_payment">Mobile Payment</option>
                </select>
              </div>
              <div className="flex items-end">
                <div className="bg-green-50 p-4 rounded-lg w-full">
                  <div className="text-sm text-gray-600">Estimated Total Cost</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(calculateTotalCost())}
                  </div>
                  <div className="text-xs text-gray-500">
                    Duration: {getDuration()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requirements or Notes
            </label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any special requirements, delivery instructions, or additional notes..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
