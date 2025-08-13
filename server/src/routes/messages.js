const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Message, Match, User } = require('../models');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Send a message
router.post('/', async (req, res) => {
  try {
    const { match_id, message } = req.body;
    const sender_id = req.userId;

    if (!match_id || !message) {
      return res.status(400).json({ error: 'match_id and message are required' });
    }

    // Verify the match exists and user is part of it
    const match = await Match.findById(match_id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.user_id !== sender_id && match.target_user_id !== sender_id) {
      return res.status(403).json({ error: 'Unauthorized to send message to this match' });
    }

    // Create message
    const messageId = uuidv4();
    const newMessage = new Message({
      _id: messageId,
      match_id,
      sender_id,
      message,
      message_type: 'text'
    });

    await newMessage.save();

    // Get sender info for response
    const sender = await User.findById(sender_id).select('name profile_picture');

    res.status(201).json({
      id: messageId,
      match_id,
      sender_id,
      sender_name: sender?.name,
      sender_avatar: sender?.profile_picture,
      message,
      message_type: 'text',
      read: false,
      created_at: newMessage.created_at
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for a match
router.get('/match/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of this match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.user_id !== userId && match.target_user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to access these messages' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get messages with sender information
    const messages = await Message.find({ match_id: matchId })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get unique sender IDs
    const senderIds = [...new Set(messages.map(msg => msg.sender_id))];
    const senders = await User.find({ _id: { $in: senderIds } }).select('_id name profile_picture');
    const sendersMap = {};
    senders.forEach(sender => {
      sendersMap[sender._id] = sender;
    });

    // Format messages with sender info
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      match_id: msg.match_id,
      sender_id: msg.sender_id,
      sender_name: sendersMap[msg.sender_id]?.name,
      sender_avatar: sendersMap[msg.sender_id]?.profile_picture,
      message: msg.message,
      message_type: msg.message_type,
      read: msg.read,
      created_at: msg.created_at
    })).reverse(); // Show oldest messages first

    res.json(formattedMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Get all conversations for current user
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.userId;

    // Get matches where user is involved
    const matches = await Match.find({
      $or: [
        { user_id: userId },
        { target_user_id: userId }
      ],
      is_mutual: true
    }).sort({ created_at: -1 });

    const conversations = [];

    for (const match of matches) {
      // Get the other user in the match
      const otherUserId = match.user_id === userId ? match.target_user_id : match.user_id;
      const otherUser = await User.findById(otherUserId).select('_id name profile_picture');

      // Get last message
      const lastMessage = await Message.findOne({ match_id: match._id })
        .sort({ created_at: -1 });

      // Get unread message count
      const unreadCount = await Message.countDocuments({
        match_id: match._id,
        sender_id: { $ne: userId },
        read: false
      });

      conversations.push({
        match_id: match._id,
        other_user: {
          id: otherUser._id,
          name: otherUser.name,
          profile_picture: otherUser.profile_picture
        },
        last_message: lastMessage ? {
          content: lastMessage.message,
          sender_id: lastMessage.sender_id,
          created_at: lastMessage.created_at
        } : null,
        unread_count: unreadCount,
        created_at: match.created_at
      });
    }

    // Sort by last message time or match creation time
    conversations.sort((a, b) => {
      const timeA = a.last_message ? new Date(a.last_message.created_at) : new Date(a.created_at);
      const timeB = b.last_message ? new Date(b.last_message.created_at) : new Date(b.created_at);
      return timeB - timeA;
    });

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Mark messages as read
router.put('/read/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.userId;

    // Verify user is part of this match
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.user_id !== userId && match.target_user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to mark messages as read' });
    }

    // Mark all messages in this match as read (except messages sent by current user)
    await Message.updateMany(
      { 
        match_id: matchId, 
        sender_id: { $ne: userId },
        read: false 
      },
      { read: true }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Delete a message (only sender can delete)
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender_id !== userId) {
      return res.status(403).json({ error: 'Can only delete your own messages' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;