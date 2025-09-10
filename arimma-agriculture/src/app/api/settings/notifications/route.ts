import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const notificationData = await request.json();
    
    console.log('Updating notification settings with data:', notificationData);

    // For now, we'll use mock data since we don't have the actual database tables set up
    // In a real application, this would update the user_preferences table
    console.log('Notification settings update successful (mock)');
    
    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      settings: notificationData
    }, { status: 200 });

  } catch (error) {
    console.error('Notification settings update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


