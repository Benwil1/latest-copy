const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User, Match } = require('../models');

const router = express.Router();

// Record like/dislike action
router.post('/action', async (req, res) => {
  try {
    const { target_user_id, action } = req.body;
    const user_id = req.userId;

    if (!target_user_id || !action) {
      return res.status(400).json({ error: 'target_user_id and action are required' });
    }

    if (!['like', 'dislike'].includes(action)) {
      return res.status(400).json({ error: 'action must be like or dislike' });
    }

    if (target_user_id === user_id) {
      return res.status(400).json({ error: 'Cannot match with yourself' });
    }

    // Check if target user exists
    const targetUser = await User.findById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // Check if action already exists
    const existingMatch = await Match.findOne({ user_id, target_user_id });
    if (existingMatch) {
      return res.status(400).json({ error: 'Action already recorded for this user' });
    }

    // Create new match record
    const matchRecord = new Match({
      _id: uuidv4(),
      user_id,
      target_user_id,
      action
    });

    await matchRecord.save();

    // Check for mutual match if this is a like
    let isMutualMatch = false;
    if (action === 'like') {
      const reverseMatch = await Match.findOne({
        user_id: target_user_id,
        target_user_id: user_id,
        action: 'like'
      });

      if (reverseMatch) {
        isMutualMatch = true;
        // Update both records to indicate mutual match
        await Promise.all([
          Match.findByIdAndUpdate(matchRecord._id, { is_mutual: true }),
          Match.findByIdAndUpdate(reverseMatch._id, { is_mutual: true })
        ]);
      }
    }

    res.json({
      message: `${action} recorded successfully`,
      match_id: matchRecord._id,
      is_mutual_match: isMutualMatch
    });
  } catch (error) {
    console.error('Match action error:', error);
    res.status(500).json({ error: 'Failed to record match action' });
  }
});

// Get current user's matches
router.get('/', async (req, res) => {
  try {
    const user_id = req.userId;

    // Get all mutual matches for the current user
    const matches = await Match.find({
      user_id,
      action: 'like',
      is_mutual: true
    }).sort({ created_at: -1 });

    // Get matched user details
    const matchedUsers = await Promise.all(matches.map(async (match) => {
      const user = await User.findById(match.target_user_id)
        .select('name age location bio interests profile_picture verification_status');
      
      return {
        match_id: match._id,
        user: {
          id: user._id,
          name: user.name,
          age: user.age,
          location: user.location,
          bio: user.bio,
          interests: user.interests || [],
          profile_picture: user.profile_picture,
          verification_status: user.verification_status
        },
        matched_at: match.created_at
      };
    }));

    res.json(matchedUsers);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// Get users who liked current user
router.get('/likes-me', async (req, res) => {
  try {
    const target_user_id = req.userId;

    // Get all users who liked the current user
    const likes = await Match.find({
      target_user_id,
      action: 'like'
    }).sort({ created_at: -1 });

    // Get user details and check if current user has also liked them
    const likedByUsers = await Promise.all(likes.map(async (like) => {
      const user = await User.findById(like.user_id)
        .select('name age location bio interests profile_picture verification_status');

      // Check if current user has liked them back
      const reciprocalLike = await Match.findOne({
        user_id: target_user_id,
        target_user_id: like.user_id,
        action: 'like'
      });

      return {
        user: {
          id: user._id,
          name: user.name,
          age: user.age,
          location: user.location,
          bio: user.bio,
          interests: user.interests || [],
          profile_picture: user.profile_picture,
          verification_status: user.verification_status
        },
        liked_at: like.created_at,
        is_mutual: like.is_mutual,
        have_i_liked_back: !!reciprocalLike
      };
    }));

    res.json(likedByUsers);
  } catch (error) {
    console.error('Get likes-me error:', error);
    res.status(500).json({ error: 'Failed to get users who liked you' });
  }
});

// Get match statistics
router.get('/stats', async (req, res) => {
  try {
    const user_id = req.userId;

    const [
      totalLikes,
      totalDislikes,
      mutualMatches,
      likesReceived
    ] = await Promise.all([
      Match.countDocuments({ user_id, action: 'like' }),
      Match.countDocuments({ user_id, action: 'dislike' }),
      Match.countDocuments({ user_id, action: 'like', is_mutual: true }),
      Match.countDocuments({ target_user_id: user_id, action: 'like' })
    ]);

    res.json({
      total_likes_given: totalLikes,
      total_dislikes_given: totalDislikes,
      mutual_matches: mutualMatches,
      likes_received: likesReceived,
      match_rate: totalLikes > 0 ? (mutualMatches / totalLikes * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({ error: 'Failed to get match statistics' });
  }
});

// Unmatch (remove mutual match)
router.delete('/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const user_id = req.userId;

    // Find the match record
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Verify user is part of this match
    if (match.user_id !== user_id && match.target_user_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to unmatch this user' });
    }

    // Find and update both match records
    const [userMatch, targetMatch] = await Promise.all([
      Match.findOne({ user_id: match.user_id, target_user_id: match.target_user_id }),
      Match.findOne({ user_id: match.target_user_id, target_user_id: match.user_id })
    ]);

    // Set is_mutual to false for both records
    await Promise.all([
      userMatch ? Match.findByIdAndUpdate(userMatch._id, { is_mutual: false }) : Promise.resolve(),
      targetMatch ? Match.findByIdAndUpdate(targetMatch._id, { is_mutual: false }) : Promise.resolve()
    ]);

    res.json({ message: 'Successfully unmatched' });
  } catch (error) {
    console.error('Unmatch error:', error);
    res.status(500).json({ error: 'Failed to unmatch user' });
  }
});

module.exports = router;