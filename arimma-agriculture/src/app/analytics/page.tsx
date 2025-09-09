'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HarvestRevenueData {
  month: string;
  harvest: number;
  revenue: number;
  pricePerKg: number;
  weatherCondition: string;
}

interface CropPerformance {
  crop: string;
  plantedArea: number;
  yield: number;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  status: string;
  trend: string;
}

interface WeatherImpact {
  temperature: {
    current: number;
    optimal: number;
    impact: string;
    recommendation: string;
  };
  rainfall: {
    current: number;
    average: number;
    impact: string;
    recommendation: string;
  };
  humidity: {
    current: number;
    optimal: number;
    impact: string;
    recommendation: string;
  };
}

interface Recommendation {
  category: string;
  priority: string;
  title: string;
  description: string;
  impact: string;
  cost: number;
  roi: number;
}

interface MarketTrends {
  currentPrices: {
    maize: number;
    wheat: number;
    soybeans: number;
    sunflower: number;
  };
  priceChanges: {
    maize: number;
    wheat: number;
    soybeans: number;
    sunflower: number;
  };
  demandForecast: {
    maize: string;
    wheat: string;
    soybeans: string;
    sunflower: string;
  };
}

interface FinancialSummary {
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const result = await response.json();

      if (result.success) {
        setAnalyticsData(result.data);
      } else {
        setError(result.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError('Failed to fetch analytics data');
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Average': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '📈' : '📉';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">Analytics data is not available at the moment.</p>
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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Farm Analytics & Yield Optimization</h1>
              <p className="text-gray-600">Comprehensive insights to maximize your agricultural productivity and profitability</p>
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

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-green-600 text-sm font-medium">Total Revenue</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {formatCurrency(analyticsData.financialSummary.totalRevenue)}
            </h3>
            <p className="text-sm text-gray-500">Last 12 months</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-blue-600 text-sm font-medium">Net Profit</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {formatCurrency(analyticsData.financialSummary.netProfit)}
            </h3>
            <p className="text-sm text-gray-500">
              {analyticsData.financialSummary.profitMargin.toFixed(1)}% margin
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-purple-600 text-sm font-medium">ROI</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {analyticsData.financialSummary.roi.toFixed(1)}%
            </h3>
            <p className="text-sm text-gray-500">Return on investment</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">🌾</span>
              </div>
              <span className="text-orange-600 text-sm font-medium">Avg Yield</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {analyticsData.cropPerformance.reduce((sum: number, crop: CropPerformance) => sum + crop.yield, 0) / analyticsData.cropPerformance.length} t/ha
            </h3>
            <p className="text-sm text-gray-500">Across all crops</p>
          </div>
        </div>

        {/* Harvest vs Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Harvest vs Revenue Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Harvest (kg)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Price/kg</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Weather</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.harvestRevenueData.map((month: HarvestRevenueData, index: number) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{month.month}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{month.harvest.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(month.revenue)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(month.pricePerKg)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        month.weatherCondition === 'Sunny' ? 'bg-yellow-100 text-yellow-800' :
                        month.weatherCondition === 'Cloudy' ? 'bg-gray-100 text-gray-800' :
                        month.weatherCondition === 'Rainy' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {month.weatherCondition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crop Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Crop Performance</h2>
            <div className="space-y-4">
              {analyticsData.cropPerformance.map((crop: CropPerformance, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{crop.crop}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                        {crop.status}
                      </span>
                      <span className="text-lg">{getTrendIcon(crop.trend)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <span className="ml-2 font-medium">{crop.plantedArea} ha</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Yield:</span>
                      <span className="ml-2 font-medium">{crop.yield} t/ha</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Revenue:</span>
                      <span className="ml-2 font-medium">{formatCurrency(crop.revenue)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Profit:</span>
                      <span className="ml-2 font-medium">{formatCurrency(crop.profit)}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Profit Margin</span>
                      <span>{crop.profitMargin.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(crop.profitMargin, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Impact */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Weather Impact Analysis</h2>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Temperature</h3>
                  <span className="text-2xl">🌡️</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Current: {analyticsData.weatherImpact.temperature.current}°C | 
                  Optimal: {analyticsData.weatherImpact.temperature.optimal}°C
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Impact:</strong> {analyticsData.weatherImpact.temperature.impact}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  💡 {analyticsData.weatherImpact.temperature.recommendation}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Rainfall</h3>
                  <span className="text-2xl">🌧️</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Current: {analyticsData.weatherImpact.rainfall.current}mm | 
                  Average: {analyticsData.weatherImpact.rainfall.average}mm
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Impact:</strong> {analyticsData.weatherImpact.rainfall.impact}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  💡 {analyticsData.weatherImpact.rainfall.recommendation}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">Humidity</h3>
                  <span className="text-2xl">💧</span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Current: {analyticsData.weatherImpact.humidity.current}% | 
                  Optimal: {analyticsData.weatherImpact.humidity.optimal}%
                </div>
                <div className="text-sm text-gray-700">
                  <strong>Impact:</strong> {analyticsData.weatherImpact.humidity.impact}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  💡 {analyticsData.weatherImpact.humidity.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yield Optimization Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Yield Optimization Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData.recommendations.map((rec: Recommendation, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{rec.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expected Impact:</span>
                    <span className="font-medium text-green-600">{rec.impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Implementation Cost:</span>
                    <span className="font-medium">{formatCurrency(rec.cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ROI:</span>
                    <span className="font-medium text-blue-600">{rec.roi}%</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Implement Recommendation
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Market Trends & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(analyticsData.marketTrends.currentPrices).map(([crop, price]) => (
              <div key={crop} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2 capitalize">{crop}</h3>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {formatCurrency(price as number)}
                </div>
                <div className={`text-sm font-medium ${
                  (analyticsData.marketTrends.priceChanges as any)[crop] > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(analyticsData.marketTrends.priceChanges as any)[crop] > 0 ? '↗' : '↘'} 
                  {Math.abs((analyticsData.marketTrends.priceChanges as any)[crop])}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Demand: {(analyticsData.marketTrends.demandForecast as any)[crop]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
