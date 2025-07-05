import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MatchModel, { IMatch } from '@/models/Match';
import UserModel from '@/models/User'; // To update user's matches array
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

// Create a "like" action or new match entry
export async function POST(req: NextRequest) {
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
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const likerId = decodedPayload.userId as string; // User performing the like

    const body = await req.json();
    const { likedUserId }: { likedUserId: string } = body; // User being liked

    if (!likedUserId) {
      return NextResponse.json({ success: false, message: 'likedUserId is required' }, { status: 400 });
    }

    if (likerId === likedUserId) {
      return NextResponse.json({ success: false, message: 'Cannot like yourself' }, { status: 400 });
    }

    await dbConnect();

    // Check if the liked user exists
    const likedUserExists = await UserModel.findById(likedUserId);
    if (!likedUserExists) {
        return NextResponse.json({ success: false, message: 'User to be liked not found' }, { status: 404 });
    }

    // Scenario 1: Check if likedUserId has already liked likerId (a reverse like exists)
    let existingMatch = await MatchModel.findOne({ user1: likedUserId, user2: likerId });

    if (existingMatch) {
      if (existingMatch.status === 'pending') {
        // This is a mutual match!
        existingMatch.status = 'matched';
        existingMatch.matchedAt = new Date();
        existingMatch.lastMessageAt = new Date(); // Initialize for sorting active chats
        await existingMatch.save();

        // Add to both users' matches array (if your User model has it)
        await UserModel.findByIdAndUpdate(likerId, { $addToSet: { matches: existingMatch._id } });
        await UserModel.findByIdAndUpdate(likedUserId, { $addToSet: { matches: existingMatch._id } });

        return NextResponse.json(
          { success: true, message: 'It\'s a match!', data: existingMatch, matchStatus: 'matched' },
          { status: 200 }
        );
      } else if (existingMatch.status === 'matched') {
        return NextResponse.json(
          { success: true, message: 'You are already matched with this user', data: existingMatch, matchStatus: 'already_matched' },
          { status: 200 }
        );
      } else if (existingMatch.status.startsWith('blocked')) {
        return NextResponse.json(
            { success: false, message: 'Interaction is blocked with this user', matchStatus: 'blocked' },
            { status: 403 }
          );
      }
    }

    // Scenario 2: No reverse like, or it's not 'pending'. Check if likerId has already liked likedUserId.
    existingMatch = await MatchModel.findOne({ user1: likerId, user2: likedUserId });
    if (existingMatch) {
        if (existingMatch.status === 'pending') {
            return NextResponse.json(
                { success: true, message: 'You have already liked this user. Waiting for them to respond.', data: existingMatch, matchStatus: 'pending' },
                { status: 200 }
            );
        } else if (existingMatch.status === 'matched') {
             return NextResponse.json( // Should have been caught by scenario 1 if data is consistent
                { success: true, message: 'You are already matched with this user.', data: existingMatch, matchStatus: 'already_matched' },
                { status: 200 }
            );
        } else if (existingMatch.status.startsWith('blocked')) {
            return NextResponse.json(
                { success: false, message: 'Interaction is blocked with this user', matchStatus: 'blocked' },
                { status: 403 }
            );
        }
    }


    // Scenario 3: No existing match record in either direction, create a new 'pending' match.
    const newMatch = new MatchModel({
      user1: likerId,
      user2: likedUserId,
      status: 'pending',
      lastMessageAt: new Date() // Initialize for sorting
    });
    await newMatch.save();

    return NextResponse.json(
      { success: true, message: 'Like registered. Waiting for a match.', data: newMatch, matchStatus: 'pending' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create Match/Like Error:', error);
    if (error.name === 'MongoServerError' && error.code === 11000) {
        // Duplicate key error, likely from the unique index on (user1, user2)
        return NextResponse.json(
          { success: false, message: 'A like interaction already exists or is being processed.' },
          { status: 409 } // Conflict
        );
      }
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// Get user's matches (where status is 'matched')
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
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }
    const userId = decodedPayload.userId as string;

    await dbConnect();

    const matches = await MatchModel.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: 'matched',
    })
    .populate('user1', 'name profilePicture email occupation location') // Populate with fields from User model
    .populate('user2', 'name profilePicture email occupation location')
    .sort({ lastMessageAt: -1 }); // Sort by most recent interaction

    // Filter out the current user from populated fields and add the 'otherUser' field
    const processedMatches = matches.map(match => {
        const matchObj = match.toObject();
        let otherUser;
        if ((matchObj.user1 as any)._id.toString() === userId) {
            otherUser = matchObj.user2;
        } else {
            otherUser = matchObj.user1;
        }
        return { ...matchObj, otherUser };
    });


    return NextResponse.json({ success: true, data: processedMatches }, { status: 200 });

  } catch (error: any) {
    console.error('Get Matches Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
