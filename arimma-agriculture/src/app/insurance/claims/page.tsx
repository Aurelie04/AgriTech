'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface InsuranceClaim {
  id: number;
  claim_number: string;
  claim_type: string;
  incident_date: string;
  reported_date: string;
  description: string;
  estimated_loss: number;
  claim_amount: number;
  status: string;
  adjuster_notes: string;
  policy_number: string;
  product_name: string;
}

export default function ClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClaimForm, setShowClaimForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClaims();
    }
  }, [user]);

  const fetchClaims = async () => {
    try {
      const response = await fetch(`/api/insurance/claims?userId=${user?.id}`);
      const data = await response.json();
      setClaims(data.claims || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClaimTypeIcon = (type: string) => {
    switch (type) {
      case 'crop_damage': return '🌱';
      case 'asset_damage': return '🚜';
      case 'weather_loss': return '🌤️';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claims...</p>
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
              <a href="/insurance" className="text-gray-700 hover:text-green-600 transition-colors">
                Insurance
              </a>
              <button
                onClick={() => setShowClaimForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                File New Claim
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Insurance Claims</h1>
          <p className="text-gray-600">
            Track and manage your insurance claims. All claims are processed by our expert team.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">File New Claim</h3>
            <p className="text-gray-600 mb-4">Report crop damage, equipment issues, or weather losses</p>
            <button
              onClick={() => setShowClaimForm(true)}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              File Claim
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Help</h3>
            <p className="text-gray-600 mb-4">Need assistance with your claim? Contact our support team</p>
            <a
              href="mailto:gabrielnana084@gmail.com"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Contact Support
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Claims</h3>
            <p className="text-gray-600 mb-4">Monitor the status of your submitted claims</p>
            <button
              onClick={() => fetchClaims()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* Claims List */}
        {claims.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Claims Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't filed any insurance claims yet. Click the button below to file your first claim.
            </p>
            <button
              onClick={() => setShowClaimForm(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              File New Claim
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getClaimTypeIcon(claim.claim_type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Claim #{claim.claim_number}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Policy: {claim.policy_number} • Product: {claim.product_name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(claim.status)}`}>
                    {claim.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Incident Date</p>
                    <p className="font-medium">{new Date(claim.incident_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reported Date</p>
                    <p className="font-medium">{new Date(claim.reported_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated Loss</p>
                    <p className="font-medium">
                      {claim.estimated_loss ? `R${claim.estimated_loss.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-900">{claim.description}</p>
                </div>

                {claim.adjuster_notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Adjuster Notes</p>
                    <p className="text-gray-900">{claim.adjuster_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help with Your Claim?
          </h3>
          <p className="text-gray-600 mb-4">
            Our claims team is here to help you through the process. Contact us for assistance.
          </p>
          <p className="text-sm text-gray-500">
            All claim inquiries are sent to: <strong>gabrielnana084@gmail.com</strong>
          </p>
        </div>
      </main>

      {/* Claim Form Modal */}
      {showClaimForm && (
        <ClaimForm 
          onClose={() => setShowClaimForm(false)}
          onSuccess={() => {
            setShowClaimForm(false);
            fetchClaims();
          }}
        />
      )}
    </div>
  );
}

// Claim Form Component
function ClaimForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    policyId: '',
    claimType: 'crop_damage',
    incidentDate: '',
    description: '',
    estimatedLoss: '',
    contactPhone: '',
    farmLocation: '',
    witnessName: '',
    witnessPhone: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    fetchUserPolicies();
  }, []);

  const fetchUserPolicies = async () => {
    try {
      const response = await fetch(`/api/insurance/policies?userId=${user?.id}`);
      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting claim with data:', formData);

      const response = await fetch('/api/insurance/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedLoss: formData.estimatedLoss ? parseFloat(formData.estimatedLoss) : null,
          userId: user?.id
        }),
      });

      console.log('Claim response status:', response.status);

      const data = await response.json();
      console.log('Claim response data:', data);

      if (response.ok) {
        alert(`✅ Claim submitted successfully!\n\nYour claim number is: ${data.claimNumber}\n\nWe'll review your claim and contact you within 2-3 business days.`);
        onSuccess();
      } else {
        setError(data.error || 'Error submitting claim. Please try again.');
        console.error('Claim submission error:', data.error);
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">File Insurance Claim</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Policy Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Policy *</label>
              {policies.length > 0 ? (
                <select
                  value={formData.policyId}
                  onChange={(e) => setFormData({...formData, policyId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select your insurance policy</option>
                  {policies.map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      {policy.policy_number} - {policy.product_name} (R{policy.coverage_amount?.toLocaleString()})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.policyId}
                  onChange={(e) => setFormData({...formData, policyId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your policy ID"
                  required
                />
              )}
            </div>

            {/* Claim Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type *</label>
              <select
                value={formData.claimType}
                onChange={(e) => setFormData({...formData, claimType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="crop_damage">🌱 Crop Damage</option>
                <option value="asset_damage">🚜 Asset Damage</option>
                <option value="weather_loss">🌤️ Weather Loss</option>
                <option value="other">📋 Other</option>
              </select>
            </div>

            {/* Incident Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date *</label>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location *</label>
                <input
                  type="text"
                  value={formData.farmLocation}
                  onChange={(e) => setFormData({...formData, farmLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Farm address or location"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Incident Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                rows={4}
                placeholder="Please describe the incident and damage in detail. Include what happened, when, and the extent of the damage..."
                required
              />
            </div>

            {/* Estimated Loss */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Loss (ZAR)</label>
              <input
                type="number"
                value={formData.estimatedLoss}
                onChange={(e) => setFormData({...formData, estimatedLoss: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter estimated loss amount"
                min="0"
                step="0.01"
              />
            </div>

            {/* Witness Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Witness Name</label>
                <input
                  type="text"
                  value={formData.witnessName}
                  onChange={(e) => setFormData({...formData, witnessName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Name of witness (if any)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Witness Phone</label>
                <input
                  type="tel"
                  value={formData.witnessPhone}
                  onChange={(e) => setFormData({...formData, witnessPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Witness phone number"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="Any additional information that might help with your claim..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
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
                {loading ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
