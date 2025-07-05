import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MessageModel, { IMessage } from '@/models/Message';
import MatchModel from '@/models/Match'; // To verify conversation (match) exists and update lastMessageAt
import UserModel from '@/models/User';
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

// Send a new message
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

    const senderId = decodedPayload.userId as string;

    const body = await req.json();
    const { conversationId, text, imageUrl }: { conversationId: string, text?: string, imageUrl?: string } = body;

    if (!conversationId) {
      return NextResponse.json({ success: false, message: 'conversationId is required' }, { status: 400 });
    }
    if (!text && !imageUrl) {
        return NextResponse.json({ success: false, message: 'Message must have text or an image.' }, { status: 400 });
    }
    if (!conversationId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid conversationId (matchId) format' }, { status: 400 });
    }


    await dbConnect();

    // Verify the conversation (match) exists and the sender is part of it
    const conversation = await MatchModel.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ success: false, message: 'Conversation (match) not found' }, { status: 404 });
    }

    const user1Str = conversation.user1.toString();
    const user2Str = conversation.user2.toString();

    if (user1Str !== senderId && user2Str !== senderId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You are not part of this conversation.' },
        { status: 403 }
      );
    }

    if (conversation.status !== 'matched') {
        return NextResponse.json(
            { success: false, message: 'You can only send messages in a matched conversation.' },
            { status: 403 }
        );
    }


    const newMessage = new MessageModel({
      conversationId,
      sentBy: senderId,
      text,
      imageUrl,
      readBy: [senderId] // Sender has implicitly read the message
    });

    await newMessage.save();

    // Update lastMessageAt in the Match model to keep conversations sorted
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // TODO: Implement real-time push notifications (e.g., WebSockets, Pusher) to the other user.
    // For now, the client will poll or refetch.

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: newMessage,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Send Message Error:', error);
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

// Get messages for a conversation (matchId)
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
    const currentUserId = decodedPayload.userId as string;

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10); // Number of messages per page

    if (!conversationId) {
      return NextResponse.json({ success: false, message: 'conversationId query parameter is required' }, { status: 400 });
    }
    if (!conversationId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid conversationId (matchId) format' }, { status: 400 });
    }

    await dbConnect();

    // Verify the conversation (match) exists and the current user is part of it
    const conversation = await MatchModel.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ success: false, message: 'Conversation (match) not found' }, { status: 404 });
    }

    if (conversation.user1.toString() !== currentUserId && conversation.user2.toString() !== currentUserId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You are not part of this conversation.' },
        { status: 403 }
      );
    }

    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({ conversationId })
      .populate('sentBy', 'name profilePicture') // Populate sender info
      .sort({ createdAt: -1 }) // Get newest messages first for typical chat pagination (then reverse on client if needed)
      .skip(skip)
      .limit(limit);

    const totalMessages = await MessageModel.countDocuments({ conversationId });
    const totalPages = Math.ceil(totalMessages / limit);

    // TODO: Implement message read status updates.
    // When messages are fetched by a user, mark them as read by that user.
    // This could be a separate PUT request or done here.
    // Example: await MessageModel.updateMany(
    //   { conversationId, sentBy: { $ne: currentUserId }, readBy: { $ne: currentUserId } },
    //   { $addToSet: { readBy: currentUserId } }
    // );


    return NextResponse.json(
      {
        success: true,
        data: messages.reverse(), // Reverse to show oldest first for chronological display
        pagination: {
            currentPage: page,
            totalPages,
            totalMessages,
            limit,
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get Messages Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
