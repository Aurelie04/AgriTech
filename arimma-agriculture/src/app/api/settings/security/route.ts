import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const securityData = await request.json();
    
    console.log('Updating security settings with data:', securityData);

    // For now, we'll use mock data since we don't have the actual database tables set up
    // In a real application, this would update the user_preferences table
    console.log('Security settings update successful (mock)');
    
    return NextResponse.json({
      success: true,
      message: 'Security settings updated successfully',
      settings: securityData
    }, { status: 200 });

  } catch (error) {
    console.error('Security settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


