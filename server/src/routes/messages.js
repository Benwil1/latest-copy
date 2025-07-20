const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();
const db = getDatabase();

// Get user's conversations
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, 
               u1.name as participant1_name, u1.profile_picture as participant1_avatar,
               u2.name as participant2_name, u2.profile_picture as participant2_avatar,
               m.content as last_message_content, m.created_at as last_message_time,
               m.sender_id as last_message_sender
        FROM conversations c
        JOIN users u1 ON c.participant1_id = u1.id
        JOIN users u2 ON c.participant2_id = u2.id
        LEFT JOIN messages m ON c.last_message_id = m.id
        WHERE c.participant1_id = ? OR c.participant2_id = ?
        ORDER BY c.last_activity DESC
      `, [req.userId, req.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const processedConversations = conversations.map(conv => {
      const isCurrentUserParticipant1 = conv.participant1_id === req.userId;
      const otherUser = {
        id: isCurrentUserParticipant1 ? conv.participant2_id : conv.participant1_id,
        name: isCurrentUserParticipant1 ? conv.participant2_name : conv.participant1_name,
        avatar: isCurrentUserParticipant1 ? conv.participant2_avatar : conv.participant1_avatar
      };

      return {
        id: conv.id,
        other_user: otherUser,
        last_message: conv.last_message_content ? {
          content: conv.last_message_content,
          sender_id: conv.last_message_sender,
          created_at: conv.last_message_time
        } : null,
        last_activity: conv.last_activity
      };
    });

    res.json(processedConversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Get messages in a conversation
router.get('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is participant in this conversation
    const conversation = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM conversations 
        WHERE id = ? AND (participant1_id = ? OR participant2_id = ?)
      `, [conversationId, req.userId, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Get messages
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const messages = await new Promise((resolve, reject) => {
      db.all(`
        SELECT m.*, u.name as sender_name, u.profile_picture as sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
      `, [conversationId, parseInt(limit), offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(messages.reverse()); // Reverse to show oldest first
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Send a message
router.post('/send', validateRequest(schemas.sendMessage), async (req, res) => {
  try {
    const { conversation_id, content, message_type = 'text' } = req.body;

    // Check if user is participant in this conversation
    const conversation = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM conversations 
        WHERE id = ? AND (participant1_id = ? OR participant2_id = ?)
      `, [conversation_id, req.userId, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Create message
    const messageId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO messages (id, conversation_id, sender_id, content, message_type)
        VALUES (?, ?, ?, ?, ?)
      `, [messageId, conversation_id, req.userId, content, message_type], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Update conversation's last message and activity
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE conversations 
        SET last_message_id = ?, last_activity = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [messageId, conversation_id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Get the created message with sender info
    const message = await new Promise((resolve, reject) => {
      db.get(`
        SELECT m.*, u.name as sender_name, u.profile_picture as sender_avatar
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.id = ?
      `, [messageId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start a conversation with a user
router.post('/conversations', async (req, res) => {
  try {
    const { participant_id } = req.body;

    if (!participant_id) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    if (participant_id === req.userId) {
      return res.status(400).json({ error: 'Cannot start conversation with yourself' });
    }

    // Check if conversation already exists
    let conversation = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM conversations 
        WHERE (participant1_id = ? AND participant2_id = ?) OR 
              (participant1_id = ? AND participant2_id = ?)
      `, [req.userId, participant_id, participant_id, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (conversation) {
      return res.json({ conversation_id: conversation.id, message: 'Conversation already exists' });
    }

    // Create new conversation
    const conversationId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO conversations (id, participant1_id, participant2_id)
        VALUES (?, ?, ?)
      `, [conversationId, req.userId, participant_id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(201).json({ 
      conversation_id: conversationId, 
      message: 'Conversation created successfully' 
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Mark messages as read
router.put('/conversations/:conversationId/read', async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Check if user is participant in this conversation
    const conversation = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM conversations 
        WHERE id = ? AND (participant1_id = ? OR participant2_id = ?)
      `, [conversationId, req.userId, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Mark all unread messages as read
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE messages 
        SET read_at = CURRENT_TIMESTAMP 
        WHERE conversation_id = ? AND sender_id != ? AND read_at IS NULL
      `, [conversationId, req.userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

module.exports = router;