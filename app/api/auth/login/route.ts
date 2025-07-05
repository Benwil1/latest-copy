import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/User';
import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User'; // Import IUser interface

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password }: Partial<IUser> = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user by email and explicitly select the password field
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 } // Unauthorized
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // User matched, create JWT payload
    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      // Add other non-sensitive info if needed
    };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d', // Token expiration (e.g., 1 day, 7d, 30d)
    });

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };

    // Set token in an HttpOnly cookie (more secure for web)
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        token, // Also returning token in body for flexibility (e.g. mobile clients)
        data: userResponse,
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1, // 1 day in seconds
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
