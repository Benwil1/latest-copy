import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MatchModel, { IMatch } from '@/models/Match';
import UserModel from '@/models/User';
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

interface RequestContext {
  params: {
    id: string; // Match ID
  };
}

// Update a match (e.g., unmatch, block)
export async function PUT(req: NextRequest, { params }: RequestContext) {
  try {
    const matchId = params.id;

    if (!matchId.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ success: false, message: 'Invalid match ID format' }, { status: 400 });
    }

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
    const currentUserId = decodedPayload.userId as string;

    const body = await req.json();
    const { status }: { status: 'unmatched' | 'blocked' } = body; // Define allowed status updates

    if (!status || !['unmatched', 'blocked'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status provided. Must be "unmatched" or "blocked".' },
        { status: 400 }
      );
    }

    await dbConnect();

    const match = await MatchModel.findById(matchId);

    if (!match) {
      return NextResponse.json({ success: false, message: 'Match not found' }, { status: 404 });
    }

    // Check if the current user is part of this match
    const user1Str = match.user1.toString();
    const user2Str = match.user2.toString();

    if (user1Str !== currentUserId && user2Str !== currentUserId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You are not part of this match.' },
        { status: 403 }
      );
    }

    let newStatus: IMatch['status'] = match.status; // Keep current status if no change

    if (status === 'unmatched') {
      if (match.status !== 'matched') {
        return NextResponse.json(
          { success: false, message: 'Can only unmatch an already matched interaction.' },
          { status: 400 }
        );
      }
      newStatus = 'unmatched';
      // Optionally remove from users' matches arrays
      await UserModel.findByIdAndUpdate(match.user1, { $pull: { matches: match._id } });
      await UserModel.findByIdAndUpdate(match.user2, { $pull: { matches: match._id } });
    } else if (status === 'blocked') {
      // Determine who is blocking whom
      if (user1Str === currentUserId) {
        newStatus = 'blocked_by_user1';
      } else {
        newStatus = 'blocked_by_user2';
      }
      // Optionally remove from users' matches arrays if blocking also means unmatching
      if (match.status === 'matched') {
        await UserModel.findByIdAndUpdate(match.user1, { $pull: { matches: match._id } });
        await UserModel.findByIdAndUpdate(match.user2, { $pull: { matches: match._id } });
      }
    }

    if (newStatus === match.status && status !== 'blocked') { // Allow re-blocking
        return NextResponse.json(
            { success: true, message: `Match status is already ${newStatus}`, data: match },
            { status: 200 }
          );
    }

    match.status = newStatus;
    await match.save();

    return NextResponse.json(
      { success: true, message: `Match status updated to ${newStatus}`, data: match },
      { status: 200 }
    );

  } catch (error: any) {
    console.error(`Error updating match ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// Get a specific match by ID (e.g., to check status or details)
export async function GET(req: NextRequest, { params }: RequestContext) {
    try {
      const matchId = params.id;

      if (!matchId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid match ID format' }, { status: 400 });
      }

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
      const currentUserId = decodedPayload.userId as string;

      await dbConnect();

      const match = await MatchModel.findById(matchId)
        .populate('user1', 'name profilePicture email')
        .populate('user2', 'name profilePicture email');

      if (!match) {
        return NextResponse.json({ success: false, message: 'Match not found' }, { status: 404 });
      }

      // Check if the current user is part of this match
      if (match.user1._id.toString() !== currentUserId && match.user2._id.toString() !== currentUserId) {
        return NextResponse.json(
          { success: false, message: 'Forbidden: You are not part of this match.' },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, data: match }, { status: 200 });

    } catch (error: any) {
      console.error(`Error fetching match ${params.id}:`, error);
      return NextResponse.json(
        { success: false, message: error.message || 'Server Error' },
        { status: 500 }
      );
    }
  }
