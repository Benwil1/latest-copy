import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/User';
import { IUser } from '@/models/User'; // Import IUser interface

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, password } : Partial<IUser> = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and password' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create new user
    // The password will be hashed by the pre-save hook in UserSchema
    const newUser = new UserModel({
      name,
      email,
      password,
    });

    await newUser.save();

    // For security, don't return the password, even though it's hashed.
    // Mongoose 'select: false' on password field should handle this,
    // but explicitly creating a response object is safer.
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup Error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      let errors: { [key: string]: string } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        { success: false, message: 'Validation Error', errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
