'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoanProduct {
  id: string;
  name: string;
  type: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  term: number;
  termUnit: string;
  repaymentType: string;
  eligibility: any;
  features: string[];
  provider: string;
  category: string;
}

interface BlendedFinanceModel {
  id: string;
  name: string;
  description: string;
  governmentShare: number;
  privateShare: number;
  benefits: string[];
  partners: string[];
  targetGroup: string;
  maxAmount: number;
}

interface CreditScoreResult {
  creditScore: number;
  riskCategory: string;
  riskColor: string;
  factorScores: any;
  recommendations: string[];
  eligibility: any;
}

export default function FinancePage() {
  const { user } = useAuth();
  const [financeData, setFinanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('loans');
  const [selectedLoan, setSelectedLoan] = useState<LoanProduct | null>(null);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showCreditScore, setShowCreditScore] = useState(false);
  const [creditScoreResult, setCreditScoreResult] = useState<CreditScoreResult | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/finance');
      const result = await response.json();

      if (result.success) {
        setFinanceData(result.data);
      } else {
        setError(result.error || 'Failed to fetch finance data');
      }
    } catch (err) {
      console.error('Finance fetch error:', err);
      setError('Failed to fetch finance data');
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk': return 'text-green-600 bg-green-100';
      case 'Medium Risk': return 'text-yellow-600 bg-yellow-100';
      case 'Moderate Risk': return 'text-orange-600 bg-orange-100';
      case 'High Risk': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleApplyForLoan = (loan: LoanProduct) => {
    setSelectedLoan(loan);
    setShowLoanForm(true);
  };

  const handleCreditScore = () => {
    setShowCreditScore(true);
  };

  const handleLoanApplicationSuccess = (applicationId: string) => {
    setShowLoanForm(false);
    setSelectedLoan(null);
    setApplicationSuccess(applicationId);
    setTimeout(() => setApplicationSuccess(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading finance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Finance Unavailable</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchFinanceData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!financeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Finance Data</h3>
          <p className="text-gray-500">Finance data is not available at the moment.</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Agricultural Finance</h1>
              <p className="text-gray-600">Input loans, working capital, and harvest-based repayment options</p>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={handleCreditScore}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-blue-600 text-sm font-medium">Credit Score</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Check Your Credit Score</h3>
            <p className="text-gray-600 text-sm">Get instant credit assessment and loan eligibility</p>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-green-600 text-sm font-medium">Apply for Loan</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse Loan Products</h3>
            <p className="text-gray-600 text-sm">Find the perfect loan for your farming needs</p>
          </button>

          <button
            onClick={() => setActiveTab('blended')}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">🤝</span>
              </div>
              <span className="text-purple-600 text-sm font-medium">Blended Finance</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Government Partnerships</h3>
            <p className="text-gray-600 text-sm">Access subsidized loans with development partners</p>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('loans')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'loans'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Loan Products ({financeData.loanProducts?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('blended')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blended'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Blended Finance ({financeData.blendedFinanceModels?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tracking'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Loan Tracking
              </button>
            </nav>
          </div>
        </div>

        {/* Loan Products Tab */}
        {activeTab === 'loans' && (
          <div className="space-y-6">
            {financeData.loanProducts?.map((loan: LoanProduct) => (
              <div key={loan.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{loan.name}</h3>
                    <p className="text-gray-600 mb-2">{loan.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Provider: {loan.provider}</span>
                      <span>Category: {loan.category}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {loan.repaymentType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Loan Amount</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(loan.minAmount)} - {formatCurrency(loan.maxAmount)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Interest Rate</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {loan.interestRate}% per annum
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Loan Term</h4>
                    <div className="text-2xl font-bold text-purple-600">
                      {loan.term} {loan.termUnit}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {loan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleApplyForLoan(loan)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply for Loan
                  </button>
                  <button
                    onClick={() => alert('View loan details')}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blended Finance Tab */}
        {activeTab === 'blended' && (
          <div className="space-y-6">
            {financeData.blendedFinanceModels?.map((model: BlendedFinanceModel) => (
              <div key={model.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{model.name}</h3>
                    <p className="text-gray-600 mb-2">{model.description}</p>
                    <div className="text-sm text-gray-500">
                      Target: {model.targetGroup} | Max Amount: {formatCurrency(model.maxAmount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Funding Mix</div>
                    <div className="text-lg font-semibold">
                      {model.governmentShare}% Gov / {model.privateShare}% Private
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Partners</h4>
                  <div className="flex flex-wrap gap-2">
                    {model.partners.map((partner, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {model.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => alert('Apply for blended finance')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply for Blended Finance
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Loan Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">My Loan Applications</h3>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📋</div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Active Applications</h4>
                <p className="text-gray-500 mb-4">You haven't submitted any loan applications yet.</p>
                <button
                  onClick={() => setActiveTab('loans')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Loan Products
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Tracking Status</h3>
              <div className="space-y-4">
                {financeData.loanTrackingStatuses?.map((status: any, index: number) => (
                  <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <span className="text-2xl mr-4">{status.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{status.status}</h4>
                      <p className="text-gray-600 text-sm">{status.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      status.color === 'green' ? 'bg-green-100 text-green-800' :
                      status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      status.color === 'red' ? 'bg-red-100 text-red-800' :
                      status.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {status.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Credit Score Modal */}
        {showCreditScore && (
          <CreditScoreModal
            onClose={() => setShowCreditScore(false)}
            onResult={setCreditScoreResult}
          />
        )}

        {/* Loan Application Modal */}
        {showLoanForm && selectedLoan && (
          <LoanApplicationModal
            loan={selectedLoan}
            onClose={() => setShowLoanForm(false)}
            onSuccess={handleLoanApplicationSuccess}
          />
        )}

        {/* Success Message */}
        {applicationSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <span className="text-xl mr-2">✅</span>
              <div>
                <div className="font-semibold">Loan Application Submitted!</div>
                <div className="text-sm text-green-100">Application ID: {applicationSuccess}</div>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date(financeData.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// Credit Score Modal Component
function CreditScoreModal({ onClose, onResult }: { onClose: () => void; onResult: (result: any) => void }) {
  const [formData, setFormData] = useState({
    farmSize: '',
    experience: '',
    previousLoans: false,
    bankStatements: false,
    financialStatements: false,
    taxReturns: false,
    crops: [],
    marketContracts: false,
    exportLicense: false,
    cooperativeMembership: false,
    directMarketAccess: false,
    irrigationSystem: false,
    modernEquipment: false,
    precisionFarming: false,
    digitalTools: false,
    sustainablePractices: false,
    cropInsurance: false,
    equipmentInsurance: false,
    liabilityInsurance: false
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting credit score form with data:', formData);
      
      const response = await fetch('/api/finance/credit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('Credit score response status:', response.status);
      
      const data = await response.json();
      console.log('Credit score response data:', data);
      
      if (data.success) {
        setResult(data.data);
        onResult(data.data);
      } else {
        console.error('Credit score API error:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Credit score error:', error);
      alert('Failed to calculate credit score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-green-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Credit Score Results</h2>
              <button onClick={onClose} className="text-white hover:text-green-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-green-600 mb-2">{result.creditScore}</div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getRiskColor(result.riskCategory)}`}>
                {result.riskCategory}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Factor Breakdown</h3>
                {Object.entries(result.factorScores).map(([factor, score]: [string, any]) => (
                  <div key={factor} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium">{score}/100</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Recommendations</h3>
                <ul className="space-y-1">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Eligibility</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Approved:</span>
                    <span className={result.eligibility.approved ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {result.eligibility.approved ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Loan Amount:</span>
                    <span className="font-medium">R {result.eligibility.maxLoanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate Adjustment:</span>
                    <span className="font-medium">{result.eligibility.interestRateAdjustment > 0 ? '+' : ''}{result.eligibility.interestRateAdjustment}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setResult(null); }}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Credit Score Assessment</h2>
            <button onClick={onClose} className="text-white hover:text-green-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (hectares) *</label>
                <input
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience (years) *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial History</h3>
            <div className="space-y-3">
              {[
                { name: 'previousLoans', label: 'Previous loan experience' },
                { name: 'bankStatements', label: 'Bank statements available' },
                { name: 'financialStatements', label: 'Financial statements available' },
                { name: 'taxReturns', label: 'Tax returns available' }
              ].map((item) => (
                <label key={item.name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData[item.name as keyof typeof formData] as boolean}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Market Access</h3>
            <div className="space-y-3">
              {[
                { name: 'marketContracts', label: 'Market contracts available' },
                { name: 'exportLicense', label: 'Export license' },
                { name: 'cooperativeMembership', label: 'Cooperative membership' },
                { name: 'directMarketAccess', label: 'Direct market access' }
              ].map((item) => (
                <label key={item.name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData[item.name as keyof typeof formData] as boolean}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Technology & Insurance</h3>
            <div className="space-y-3">
              {[
                { name: 'irrigationSystem', label: 'Irrigation system' },
                { name: 'modernEquipment', label: 'Modern equipment' },
                { name: 'precisionFarming', label: 'Precision farming practices' },
                { name: 'digitalTools', label: 'Digital farming tools' },
                { name: 'sustainablePractices', label: 'Sustainable farming practices' },
                { name: 'cropInsurance', label: 'Crop insurance' },
                { name: 'equipmentInsurance', label: 'Equipment insurance' },
                { name: 'liabilityInsurance', label: 'Liability insurance' }
              ].map((item) => (
                <label key={item.name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={formData[item.name as keyof typeof formData] as boolean}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Calculating...' : 'Calculate Credit Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loan Application Modal Component
function LoanApplicationModal({ loan, onClose, onSuccess }: { loan: LoanProduct; onClose: () => void; onSuccess: (id: string) => void }) {
  const [formData, setFormData] = useState({
    farmerName: '',
    email: '',
    phone: '',
    farmSize: '',
    experience: '',
    farmLocation: '',
    annualIncome: '',
    existingDebts: '',
    bankAccount: '',
    loanPurpose: '',
    repaymentOption: loan.repaymentType,
    requestedAmount: '',
    additionalInfo: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const applicationData = {
        ...formData,
        loanProductId: loan.id,
        loanProduct: loan,
        requestedAmount: parseFloat(formData.requestedAmount)
      };
      
      console.log('Submitting loan application with data:', applicationData);
      
      const response = await fetch('/api/finance/loan-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });

      console.log('Loan application response status:', response.status);
      
      const result = await response.json();
      console.log('Loan application response data:', result);
      
      if (result.success) {
        onSuccess(result.applicationId);
      } else {
        setError(result.error || 'Failed to submit application');
        console.error('Loan application API error:', result.error);
      }
    } catch (err) {
      console.error('Application error:', err);
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Apply for {loan.name}</h2>
              <p className="text-green-100">Complete your loan application</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-green-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (hectares) *</label>
              <input
                type="number"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location</label>
              <input
                type="text"
                name="farmLocation"
                value={formData.farmLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (R)</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Existing Debts (R)</label>
              <input
                type="number"
                name="existingDebts"
                value={formData.existingDebts}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount (R) *</label>
              <input
                type="number"
                name="requestedAmount"
                value={formData.requestedAmount}
                onChange={handleInputChange}
                min={loan.minAmount}
                max={loan.maxAmount}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose *</label>
            <textarea
              name="loanPurpose"
              value={formData.loanPurpose}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe how you plan to use the loan funds..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Any additional information that might support your application..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getRiskColor(risk: string) {
  switch (risk) {
    case 'Low Risk': return 'text-green-600 bg-green-100';
    case 'Medium Risk': return 'text-yellow-600 bg-yellow-100';
    case 'Moderate Risk': return 'text-orange-600 bg-orange-100';
    case 'High Risk': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
