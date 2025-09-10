import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data for yield optimization
const generateAnalyticsData = () => {
  const currentYear = new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate harvest vs revenue data for the past 12 months
  const harvestRevenueData = months.map((month, index) => {
    const baseHarvest = 150 + Math.random() * 100;
    const baseRevenue = baseHarvest * (25 + Math.random() * 15); // R25-R40 per kg
    const weatherImpact = Math.random() * 0.3 - 0.15; // ±15% weather impact
    
    return {
      month,
      harvest: Math.round(baseHarvest * (1 + weatherImpact)),
      revenue: Math.round(baseRevenue * (1 + weatherImpact)),
      pricePerKg: Math.round((baseRevenue * (1 + weatherImpact)) / (baseHarvest * (1 + weatherImpact))),
      weatherCondition: ['Sunny', 'Cloudy', 'Rainy', 'Stormy'][Math.floor(Math.random() * 4)]
    };
  });

  // Crop performance data
  const cropPerformance = [
    {
      crop: 'Maize',
      plantedArea: 25.5,
      yield: 4.2,
      revenue: 125000,
      cost: 85000,
      profit: 40000,
      profitMargin: 32.0,
      status: 'Excellent',
      trend: 'up'
    },
    {
      crop: 'Wheat',
      plantedArea: 18.3,
      yield: 3.8,
      revenue: 95000,
      cost: 72000,
      profit: 23000,
      profitMargin: 24.2,
      status: 'Good',
      trend: 'up'
    },
    {
      crop: 'Soybeans',
      plantedArea: 12.7,
      yield: 2.9,
      revenue: 78000,
      cost: 65000,
      profit: 13000,
      profitMargin: 16.7,
      status: 'Average',
      trend: 'down'
    },
    {
      crop: 'Sunflower',
      plantedArea: 8.9,
      yield: 1.8,
      revenue: 45000,
      cost: 38000,
      profit: 7000,
      profitMargin: 15.6,
      status: 'Poor',
      trend: 'down'
    }
  ];

  // Weather impact analysis
  const weatherImpact = {
    temperature: {
      current: 24.5,
      optimal: 22.0,
      impact: 'Moderate',
      recommendation: 'Consider irrigation during hot periods'
    },
    rainfall: {
      current: 45.2,
      average: 38.7,
      impact: 'Positive',
      recommendation: 'Good moisture levels, reduce irrigation'
    },
    humidity: {
      current: 68.5,
      optimal: 65.0,
      impact: 'Slight Risk',
      recommendation: 'Monitor for fungal diseases'
    }
  };

  // Cost analysis
  const costBreakdown = {
    seeds: 15000,
    fertilizers: 25000,
    pesticides: 12000,
    labor: 18000,
    equipment: 22000,
    irrigation: 8000,
    other: 5000
  };

  const totalCost = Object.values(costBreakdown).reduce((sum, cost) => sum + cost, 0);

  // Yield optimization recommendations
  const recommendations = [
    {
      category: 'Soil Management',
      priority: 'High',
      title: 'Improve Soil pH',
      description: 'Your soil pH is 6.2. Optimal range is 6.5-7.0. Apply lime to increase yield by 8-12%.',
      impact: '8-12% yield increase',
      cost: 5000,
      roi: 180
    },
    {
      category: 'Irrigation',
      priority: 'Medium',
      title: 'Install Drip Irrigation',
      description: 'Drip irrigation can reduce water usage by 30% while maintaining yield.',
      impact: '30% water savings',
      cost: 15000,
      roi: 120
    },
    {
      category: 'Fertilization',
      priority: 'High',
      title: 'Split Fertilizer Application',
      description: 'Apply nitrogen in 3 splits instead of 2 to improve efficiency by 15%.',
      impact: '15% efficiency gain',
      cost: 2000,
      roi: 250
    },
    {
      category: 'Crop Rotation',
      priority: 'Medium',
      title: 'Implement 4-Year Rotation',
      description: 'Rotate maize, soybeans, wheat, and cover crops to improve soil health.',
      impact: '10-15% yield increase',
      cost: 3000,
      roi: 200
    }
  ];

  // Market trends
  const marketTrends = {
    currentPrices: {
      maize: 3200,
      wheat: 2800,
      soybeans: 4500,
      sunflower: 3800
    },
    priceChanges: {
      maize: 5.2,
      wheat: -2.1,
      soybeans: 8.7,
      sunflower: -1.5
    },
    demandForecast: {
      maize: 'High',
      wheat: 'Medium',
      soybeans: 'Very High',
      sunflower: 'Low'
    }
  };

  // Financial summary
  const financialSummary = {
    totalRevenue: harvestRevenueData.reduce((sum, month) => sum + month.revenue, 0),
    totalCosts: totalCost,
    netProfit: harvestRevenueData.reduce((sum, month) => sum + month.revenue, 0) - totalCost,
    profitMargin: ((harvestRevenueData.reduce((sum, month) => sum + month.revenue, 0) - totalCost) / harvestRevenueData.reduce((sum, month) => sum + month.revenue, 0)) * 100,
    roi: ((harvestRevenueData.reduce((sum, month) => sum + month.revenue, 0) - totalCost) / totalCost) * 100
  };

  // Seasonal analysis
  const seasonalAnalysis = {
    spring: { yield: 2.8, revenue: 85000, efficiency: 85 },
    summer: { yield: 4.2, revenue: 125000, efficiency: 95 },
    autumn: { yield: 3.6, revenue: 105000, efficiency: 88 },
    winter: { yield: 1.9, revenue: 55000, efficiency: 75 }
  };

  return {
    harvestRevenueData,
    cropPerformance,
    weatherImpact,
    costBreakdown,
    totalCost,
    recommendations,
    marketTrends,
    financialSummary,
    seasonalAnalysis,
    lastUpdated: new Date().toISOString()
  };
};

export async function GET(request: NextRequest) {
  try {
    const analyticsData = generateAnalyticsData();
    
    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}


