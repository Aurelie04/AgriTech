'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
    estimatedLoss: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/insurance/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedLoss: formData.estimatedLoss ? parseFloat(formData.estimatedLoss) : null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Claim submitted successfully! Your claim number is: ${data.claimNumber}`);
        onSuccess();
      } else {
        alert('Error submitting claim. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">File Insurance Claim</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy ID</label>
            <input
              type="text"
              value={formData.policyId}
              onChange={(e) => setFormData({...formData, policyId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your policy ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Claim Type</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date</label>
            <input
              type="date"
              value={formData.incidentDate}
              onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={4}
              placeholder="Please describe the incident and damage in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Loss (ZAR)</label>
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
              {loading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
