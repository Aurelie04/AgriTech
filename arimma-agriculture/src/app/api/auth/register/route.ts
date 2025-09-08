import { NextRequest, NextResponse } from 'next/server';
import { createUser, emailExists, createUserProfile } from '../../../../lib/auth';
import { testConnection } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    // Test database connection (will use mock data if DB fails)
    await testConnection();

    const body = await request.json();
    const { email, password, role, profileData } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['farmer', 'buyer', 'trader', 'financier', 'logistics'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: farmer, buyer, trader, financier, logistics' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists
    try {
      const emailAlreadyExists = await emailExists(email);
      if (emailAlreadyExists) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
      // Continue with registration if email check fails
    }

    // Create user
    const user = await createUser(email, password, role);
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create user profile if profile data is provided
    if (profileData) {
      const profile = await createUserProfile({
        user_id: user.id,
        ...profileData
      });
      
      if (!profile) {
        console.warn('User created but profile creation failed');
      }
    }

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        email_verified: user.email_verified
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
