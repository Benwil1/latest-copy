import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserModel from '@/models/User';
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;

if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    let decodedPayload;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decodedPayload = payload;
    } catch (error) {
      console.error('JWT Verification error in /api/auth/me:', error);
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    if (!decodedPayload || !decodedPayload.userId) {
        return NextResponse.json({ success: false, message: 'Invalid token payload' }, { status: 401 });
    }

    await dbConnect();

    const user = await UserModel.findById(decodedPayload.userId).select('-password'); // Exclude password

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });

  } catch (error: any) {
    console.error('/api/auth/me Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
