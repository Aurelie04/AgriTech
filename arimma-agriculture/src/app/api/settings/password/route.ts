import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const passwordData = await request.json();
    const { current_password, new_password, confirm_password } = passwordData;
    
    console.log('Changing password for user');

    // Validate required fields
    if (!current_password || !new_password || !confirm_password) {
      return NextResponse.json(
        { error: 'All password fields are required' },
        { status: 400 }
      );
    }

    // Validate password match
    if (new_password !== confirm_password) {
      return NextResponse.json(
        { error: 'New passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password length
    if (new_password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // For now, we'll use mock data since we don't have the actual database tables set up
    // In a real application, this would:
    // 1. Verify the current password
    // 2. Hash the new password
    // 3. Update the users table
    console.log('Password change successful (mock)');
    
    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
