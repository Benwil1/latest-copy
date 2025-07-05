import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel, { IUser } from '@/models/User';
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

interface RequestContext {
  params: {
    id: string;
  };
}

// Get user profile by ID
export async function GET(req: NextRequest, { params }: RequestContext) {
  try {
    const { id } = params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID format' }, { status: 400 });
    }

    await dbConnect();

    const user = await UserModel.findById(id).select('-password'); // Exclude password

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// Update user profile by ID
export async function PUT(req: NextRequest, { params }: RequestContext) {
  try {
    const { id } = params; // ID of the user to update

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ success: false, message: 'Invalid user ID format' }, { status: 400 });
    }

    // Verify JWT to get the authenticated user's ID
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    let decodedPayload;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decodedPayload = payload;
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const authenticatedUserId = decodedPayload.userId as string;

    // Ensure the authenticated user is the one being updated or is an admin (admin check not implemented here)
    if (authenticatedUserId !== id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You can only update your own profile' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    // Destructure allowed fields to update. Prevent password updates through this route.
    const { name, profilePicture, bio, age, occupation, location, preferences } : Partial<IUser> = body;

    const updateData: Partial<IUser> = {};
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (bio) updateData.bio = bio;
    if (age) updateData.age = age;
    if (occupation) updateData.occupation = occupation;
    if (location) updateData.location = location;
    if (preferences) updateData.preferences = preferences;

    // Ensure password is not updated via this route
    if (body.password) {
        return NextResponse.json(
            { success: false, message: 'Password cannot be updated through this route. Use a dedicated password change route.' },
            { status: 400 }
          );
    }


    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating user ${params.id}:`, error);
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
