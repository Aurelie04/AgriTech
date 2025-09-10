import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // For now, return mock policies since we don't have actual policy data
    // In a real application, this would query the user_insurance_policies table
    const mockPolicies = [
      {
        id: 1,
        policy_number: 'POL-2024-001',
        product_name: 'Basic Crop Protection',
        coverage_amount: 100000,
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
      },
      {
        id: 2,
        policy_number: 'POL-2024-002',
        product_name: 'Equipment Protection',
        coverage_amount: 500000,
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
      },
      {
        id: 3,
        policy_number: 'POL-2024-003',
        product_name: 'Weather Index Insurance',
        coverage_amount: 75000,
        status: 'active',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
      }
    ];

    return NextResponse.json({ 
      policies: mockPolicies,
      message: 'User policies fetched successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user policies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


