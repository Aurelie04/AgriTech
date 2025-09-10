import { NextRequest, NextResponse } from 'next/server';

// Mock finance data with loan products and credit scoring
const generateFinanceData = () => {
  // Loan products
  const loanProducts = [
    {
      id: 'loan-001',
      name: 'Agricultural Input Loan',
      type: 'input_loan',
      description: 'Short-term loan for purchasing seeds, fertilizers, and other agricultural inputs',
      minAmount: 10000,
      maxAmount: 500000,
      interestRate: 12.5,
      term: 6,
      termUnit: 'months',
      repaymentType: 'harvest_based',
      eligibility: {
        minFarmSize: 2,
        maxFarmSize: 1000,
        minExperience: 1,
        requiredDocuments: ['ID', 'Farm Registration', 'Bank Statements']
      },
      features: [
        'Quick approval (24-48 hours)',
        'No collateral required for amounts under R100,000',
        'Harvest-based repayment',
        'Insurance coverage included',
        'Mobile app tracking'
      ],
      provider: 'Agricultural Development Bank',
      category: 'Input Financing'
    },
    {
      id: 'loan-002',
      name: 'Working Capital Loan',
      type: 'working_capital',
      description: 'Medium-term loan for operational expenses and cash flow management',
      minAmount: 50000,
      maxAmount: 2000000,
      interestRate: 14.0,
      term: 12,
      termUnit: 'months',
      repaymentType: 'monthly',
      eligibility: {
        minFarmSize: 5,
        maxFarmSize: 1000,
        minExperience: 2,
        requiredDocuments: ['ID', 'Farm Registration', 'Bank Statements', 'Financial Statements']
      },
      features: [
        'Flexible repayment terms',
        'Seasonal payment adjustments',
        'Credit line facility',
        'Financial advisory services',
        'Online account management'
      ],
      provider: 'Standard Bank Agriculture',
      category: 'Working Capital'
    },
    {
      id: 'loan-003',
      name: 'Equipment Financing',
      type: 'equipment',
      description: 'Long-term loan for purchasing agricultural machinery and equipment',
      minAmount: 100000,
      maxAmount: 5000000,
      interestRate: 11.0,
      term: 36,
      termUnit: 'months',
      repaymentType: 'monthly',
      eligibility: {
        minFarmSize: 10,
        maxFarmSize: 1000,
        minExperience: 3,
        requiredDocuments: ['ID', 'Farm Registration', 'Equipment Quote', 'Financial Statements']
      },
      features: [
        'Equipment as collateral',
        'Deferred payment options',
        'Maintenance support',
        'Upgrade options',
        'Insurance included'
      ],
      provider: 'First National Bank Agriculture',
      category: 'Equipment Financing'
    },
    {
      id: 'loan-004',
      name: 'Harvest-Based Repayment Loan',
      type: 'harvest_based',
      description: 'Flexible loan with repayment tied to harvest cycles and crop sales',
      minAmount: 25000,
      maxAmount: 1000000,
      interestRate: 13.5,
      term: 18,
      termUnit: 'months',
      repaymentType: 'harvest_based',
      eligibility: {
        minFarmSize: 3,
        maxFarmSize: 1000,
        minExperience: 1,
        requiredDocuments: ['ID', 'Farm Registration', 'Crop Plan', 'Market Contracts']
      },
      features: [
        'Repayment aligned with harvest',
        'Weather risk protection',
        'Market price hedging',
        'Crop insurance integration',
        'Flexible payment schedules'
      ],
      provider: 'Land Bank',
      category: 'Harvest-Based Financing'
    },
    {
      id: 'loan-005',
      name: 'Blended Finance Loan',
      type: 'blended',
      description: 'Government-subsidized loan with development partner support',
      minAmount: 100000,
      maxAmount: 3000000,
      interestRate: 8.5,
      term: 24,
      termUnit: 'months',
      repaymentType: 'flexible',
      eligibility: {
        minFarmSize: 5,
        maxFarmSize: 500,
        minExperience: 2,
        requiredDocuments: ['ID', 'Farm Registration', 'Development Plan', 'Community Impact Assessment']
      },
      features: [
        'Government subsidy (30%)',
        'Development partner guarantee',
        'Technical assistance included',
        'Community development focus',
        'Sustainability requirements'
      ],
      provider: 'Government + Development Partners',
      category: 'Blended Finance'
    }
  ];

  // Blended finance models
  const blendedFinanceModels = [
    {
      id: 'blended-001',
      name: 'Government + Private Sector',
      description: 'Combines government subsidies with private sector funding',
      governmentShare: 40,
      privateShare: 60,
      benefits: [
        'Reduced interest rates',
        'Government guarantee',
        'Technical support',
        'Market access support'
      ],
      partners: ['Department of Agriculture', 'Standard Bank', 'Nedbank'],
      targetGroup: 'Small to medium farmers',
      maxAmount: 2000000
    },
    {
      id: 'blended-002',
      name: 'Development Bank + Commercial Bank',
      description: 'Development finance institution partners with commercial banks',
      governmentShare: 0,
      privateShare: 100,
      benefits: [
        'Lower risk profile',
        'Extended repayment terms',
        'Capacity building',
        'Innovation support'
      ],
      partners: ['Development Bank of Southern Africa', 'Absa', 'FirstRand'],
      targetGroup: 'Medium to large farmers',
      maxAmount: 5000000
    },
    {
      id: 'blended-003',
      name: 'NGO + Microfinance',
      description: 'Non-governmental organization partners with microfinance institutions',
      governmentShare: 0,
      privateShare: 100,
      benefits: [
        'Community focus',
        'Flexible terms',
        'Training programs',
        'Social impact measurement'
      ],
      partners: ['Oxfam', 'Grameen Foundation', 'Small Enterprise Finance Agency'],
      targetGroup: 'Small farmers and cooperatives',
      maxAmount: 500000
    }
  ];

  // Credit scoring factors
  const creditScoringFactors = [
    {
      factor: 'Farm Size',
      weight: 20,
      description: 'Larger farms generally have better repayment capacity',
      maxScore: 100
    },
    {
      factor: 'Farming Experience',
      weight: 15,
      description: 'Years of experience in agricultural operations',
      maxScore: 100
    },
    {
      factor: 'Financial History',
      weight: 25,
      description: 'Previous loan repayment history and financial stability',
      maxScore: 100
    },
    {
      factor: 'Crop Diversification',
      weight: 10,
      description: 'Diversified crop portfolio reduces risk',
      maxScore: 100
    },
    {
      factor: 'Market Access',
      weight: 15,
      description: 'Established market channels and contracts',
      maxScore: 100
    },
    {
      factor: 'Technology Adoption',
      weight: 10,
      description: 'Use of modern farming techniques and equipment',
      maxScore: 100
    },
    {
      factor: 'Insurance Coverage',
      weight: 5,
      description: 'Crop and equipment insurance coverage',
      maxScore: 100
    }
  ];

  // Loan tracking statuses
  const loanTrackingStatuses = [
    {
      status: 'Application Submitted',
      description: 'Loan application has been submitted and is under review',
      color: 'blue',
      icon: '📝'
    },
    {
      status: 'Under Review',
      description: 'Application is being reviewed by credit committee',
      color: 'yellow',
      icon: '🔍'
    },
    {
      status: 'Approved',
      description: 'Loan has been approved and is ready for disbursement',
      color: 'green',
      icon: '✅'
    },
    {
      status: 'Disbursed',
      description: 'Funds have been disbursed to your account',
      color: 'green',
      icon: '💰'
    },
    {
      status: 'Active',
      description: 'Loan is active and repayments are due',
      color: 'blue',
      icon: '📊'
    },
    {
      status: 'Overdue',
      description: 'Repayment is overdue and requires immediate attention',
      color: 'red',
      icon: '⚠️'
    },
    {
      status: 'Completed',
      description: 'Loan has been fully repaid',
      color: 'gray',
      icon: '🎉'
    }
  ];

  // Repayment options
  const repaymentOptions = [
    {
      id: 'monthly',
      name: 'Monthly Repayment',
      description: 'Fixed monthly payments throughout the loan term',
      advantages: ['Predictable payments', 'Easy budgeting', 'Lower interest'],
      disadvantages: ['Cash flow pressure', 'Seasonal challenges'],
      bestFor: 'Stable income farmers'
    },
    {
      id: 'harvest_based',
      name: 'Harvest-Based Repayment',
      description: 'Repayments aligned with harvest cycles and crop sales',
      advantages: ['Seasonal flexibility', 'Income-aligned payments', 'Weather protection'],
      disadvantages: ['Variable amounts', 'Market dependency'],
      bestFor: 'Crop farmers with seasonal income'
    },
    {
      id: 'quarterly',
      name: 'Quarterly Repayment',
      description: 'Payments every three months',
      advantages: ['Less frequent payments', 'Seasonal alignment', 'Flexible timing'],
      disadvantages: ['Larger payment amounts', 'Planning required'],
      bestFor: 'Medium-term operations'
    },
    {
      id: 'balloon',
      name: 'Balloon Payment',
      description: 'Small regular payments with large final payment',
      advantages: ['Lower regular payments', 'Cash flow friendly', 'Flexible final payment'],
      disadvantages: ['Large final payment', 'Refinancing risk'],
      bestFor: 'Equipment financing'
    }
  ];

  return {
    loanProducts,
    blendedFinanceModels,
    creditScoringFactors,
    loanTrackingStatuses,
    repaymentOptions,
    lastUpdated: new Date().toISOString()
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // loan_products, blended_finance, credit_scoring, etc.
    const category = searchParams.get('category'); // input_loan, working_capital, etc.

    const financeData = generateFinanceData();
    
    let filteredData = financeData;

    // Filter by type
    if (type && type !== 'all') {
      switch (type) {
        case 'loan_products':
          filteredData = { loanProducts: financeData.loanProducts };
          break;
        case 'blended_finance':
          filteredData = { blendedFinanceModels: financeData.blendedFinanceModels };
          break;
        case 'credit_scoring':
          filteredData = { creditScoringFactors: financeData.creditScoringFactors };
          break;
        case 'repayment_options':
          filteredData = { repaymentOptions: financeData.repaymentOptions };
          break;
        case 'tracking_statuses':
          filteredData = { loanTrackingStatuses: financeData.loanTrackingStatuses };
          break;
      }
    }

    // Filter loan products by category
    if (category && category !== 'all' && filteredData.loanProducts) {
      filteredData = {
        ...filteredData,
        loanProducts: filteredData.loanProducts.filter((product: any) => product.type === category)
      };
    }

    return NextResponse.json({
      success: true,
      data: filteredData
    });

  } catch (error) {
    console.error('Finance API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch finance data' },
      { status: 500 }
    );
  }
}


