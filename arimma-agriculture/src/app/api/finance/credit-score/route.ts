import { NextRequest, NextResponse } from 'next/server';

// Mock credit scoring function
const calculateCreditScore = (applicantData: any) => {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const factorScores: any = {};

  // Farm Size Score (0-100)
  const farmSize = applicantData.farmSize || 0;
  let farmSizeScore = 0;
  if (farmSize >= 100) farmSizeScore = 100;
  else if (farmSize >= 50) farmSizeScore = 80;
  else if (farmSize >= 20) farmSizeScore = 60;
  else if (farmSize >= 10) farmSizeScore = 40;
  else if (farmSize >= 5) farmSizeScore = 20;
  else farmSizeScore = 10;
  
  factorScores.farmSize = farmSizeScore;
  totalScore += farmSizeScore * 0.20;
  maxPossibleScore += 100 * 0.20;

  // Farming Experience Score (0-100)
  const experience = applicantData.experience || 0;
  let experienceScore = Math.min(experience * 10, 100);
  factorScores.experience = experienceScore;
  totalScore += experienceScore * 0.15;
  maxPossibleScore += 100 * 0.15;

  // Financial History Score (0-100)
  let financialScore = 50; // Base score
  if (applicantData.previousLoans) {
    const repaidLoans = applicantData.previousLoans.filter((loan: any) => loan.status === 'repaid').length;
    const totalLoans = applicantData.previousLoans.length;
    if (totalLoans > 0) {
      financialScore = (repaidLoans / totalLoans) * 100;
    }
  }
  if (applicantData.bankStatements) financialScore += 10;
  if (applicantData.financialStatements) financialScore += 10;
  if (applicantData.taxReturns) financialScore += 10;
  
  factorScores.financialHistory = Math.min(financialScore, 100);
  totalScore += factorScores.financialHistory * 0.25;
  maxPossibleScore += 100 * 0.25;

  // Crop Diversification Score (0-100)
  const crops = applicantData.crops || [];
  let diversificationScore = 0;
  if (crops.length >= 5) diversificationScore = 100;
  else if (crops.length >= 3) diversificationScore = 80;
  else if (crops.length >= 2) diversificationScore = 60;
  else if (crops.length >= 1) diversificationScore = 40;
  else diversificationScore = 20;
  
  factorScores.cropDiversification = diversificationScore;
  totalScore += diversificationScore * 0.10;
  maxPossibleScore += 100 * 0.10;

  // Market Access Score (0-100)
  let marketScore = 30; // Base score
  if (applicantData.marketContracts) marketScore += 20;
  if (applicantData.exportLicense) marketScore += 15;
  if (applicantData.cooperativeMembership) marketScore += 15;
  if (applicantData.directMarketAccess) marketScore += 20;
  
  factorScores.marketAccess = Math.min(marketScore, 100);
  totalScore += factorScores.marketAccess * 0.15;
  maxPossibleScore += 100 * 0.15;

  // Technology Adoption Score (0-100)
  let techScore = 20; // Base score
  if (applicantData.irrigationSystem) techScore += 15;
  if (applicantData.modernEquipment) techScore += 15;
  if (applicantData.precisionFarming) techScore += 15;
  if (applicantData.digitalTools) techScore += 15;
  if (applicantData.sustainablePractices) techScore += 20;
  
  factorScores.technologyAdoption = Math.min(techScore, 100);
  totalScore += factorScores.technologyAdoption * 0.10;
  maxPossibleScore += 100 * 0.10;

  // Insurance Coverage Score (0-100)
  let insuranceScore = 0;
  if (applicantData.cropInsurance) insuranceScore += 40;
  if (applicantData.equipmentInsurance) insuranceScore += 30;
  if (applicantData.liabilityInsurance) insuranceScore += 30;
  
  factorScores.insuranceCoverage = Math.min(insuranceScore, 100);
  totalScore += factorScores.insuranceCoverage * 0.05;
  maxPossibleScore += 100 * 0.05;

  // Calculate final score
  const finalScore = Math.round((totalScore / maxPossibleScore) * 100);
  
  // Determine risk category
  let riskCategory = 'High Risk';
  let riskColor = 'red';
  let recommendations: string[] = [];

  if (finalScore >= 80) {
    riskCategory = 'Low Risk';
    riskColor = 'green';
    recommendations = [
      'Excellent credit profile',
      'Eligible for best interest rates',
      'Consider larger loan amounts',
      'May qualify for premium products'
    ];
  } else if (finalScore >= 65) {
    riskCategory = 'Medium Risk';
    riskColor = 'yellow';
    recommendations = [
      'Good credit profile with room for improvement',
      'Consider improving crop diversification',
      'Strengthen market access channels',
      'Maintain consistent repayment history'
    ];
  } else if (finalScore >= 50) {
    riskCategory = 'Moderate Risk';
    riskColor = 'orange';
    recommendations = [
      'Credit profile needs improvement',
      'Consider smaller loan amounts initially',
      'Focus on building repayment history',
      'Improve financial documentation'
    ];
  } else {
    riskCategory = 'High Risk';
    riskColor = 'red';
    recommendations = [
      'Significant credit profile improvements needed',
      'Consider alternative financing options',
      'Focus on building farming experience',
      'Work on financial stability first'
    ];
  }

  return {
    creditScore: finalScore,
    riskCategory,
    riskColor,
    factorScores,
    recommendations,
    maxPossibleScore: Math.round(maxPossibleScore),
    eligibility: {
      approved: finalScore >= 50,
      maxLoanAmount: finalScore >= 80 ? 5000000 : finalScore >= 65 ? 2000000 : finalScore >= 50 ? 500000 : 0,
      interestRateAdjustment: finalScore >= 80 ? -2 : finalScore >= 65 ? -1 : finalScore >= 50 ? 0 : 2
    }
  };
};

export async function POST(request: NextRequest) {
  try {
    const applicantData = await request.json();
    
    console.log('Credit score API - Received data:', applicantData);
    
    // Validate required fields
    const requiredFields = ['farmSize', 'experience'];
    const missingFields = requiredFields.filter(field => {
      const value = applicantData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      console.log('Credit score API - Missing fields:', missingFields);
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          receivedData: applicantData
        },
        { status: 400 }
      );
    }
    
    // Convert string inputs to numbers
    const processedData = {
      ...applicantData,
      farmSize: parseFloat(applicantData.farmSize) || 0,
      experience: parseFloat(applicantData.experience) || 0
    };
    
    console.log('Credit score API - Processed data:', processedData);
    
    // Calculate credit score
    const creditScoreResult = calculateCreditScore(processedData);
    
    return NextResponse.json({
      success: true,
      data: creditScoreResult
    });

  } catch (error) {
    console.error('Credit scoring API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate credit score' 
      },
      { status: 500 }
    );
  }
}
