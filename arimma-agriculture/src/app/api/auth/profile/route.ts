import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile, createUserProfile } from '../../../../lib/auth';
import { testConnection } from '../../../../lib/database';

// Get user profile
export async function GET(request: NextRequest) {
  try {
    // Test database connection (will use mock data if DB fails)
    await testConnection();

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = await getUserProfile(parseInt(userId));
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Test database connection (will use mock data if DB fails)
    await testConnection();

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const profileData = body;

    // Check if profile exists
    const existingProfile = await getUserProfile(parseInt(userId));
    
    let success;
    if (existingProfile) {
      // Update existing profile
      success = await updateUserProfile(parseInt(userId), profileData);
    } else {
      // Create new profile
      const newProfile = await createUserProfile({
        user_id: parseInt(userId),
        ...profileData
      });
      success = !!newProfile;
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Get updated profile
    const updatedProfile = await getUserProfile(parseInt(userId));

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    }, { status: 200 });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
