const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();
const db = getDatabase();

// Like/dislike a user
router.post('/action', async (req, res) => {
  try {
    const { target_user_id, action } = req.body; // action: 'like' or 'dislike'
    
    if (!target_user_id || !['like', 'dislike'].includes(action)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    if (target_user_id === req.userId) {
      return res.status(400).json({ error: 'Cannot perform action on yourself' });
    }

    // Check if match already exists
    let match = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM matches 
        WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
      `, [req.userId, target_user_id, target_user_id, req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (action === 'dislike') {
      // If match exists, delete it
      if (match) {
        await new Promise((resolve, reject) => {
          db.run('DELETE FROM matches WHERE id = ?', [match.id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
      return res.json({ message: 'User disliked' });
    }

    // Handle like action
    if (!match) {
      // Create new match
      const matchId = uuidv4();
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO matches (id, user1_id, user2_id, user1_liked, user2_liked)
          VALUES (?, ?, ?, ?, ?)
        `, [matchId, req.userId, target_user_id, true, false], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      return res.json({ message: 'User liked', is_mutual: false });
    } else {
      // Update existing match
      const isCurrentUserUser1 = match.user1_id === req.userId;
      const field = isCurrentUserUser1 ? 'user1_liked' : 'user2_liked';
      const otherField = isCurrentUserUser1 ? 'user2_liked' : 'user1_liked';
      const otherUserLiked = isCurrentUserUser1 ? match.user2_liked : match.user1_liked;

      await new Promise((resolve, reject) => {
        db.run(`
          UPDATE matches 
          SET ${field} = TRUE, is_mutual = ? 
          WHERE id = ?
        `, [otherUserLiked, match.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      const isMutual = otherUserLiked;

      // If it's a mutual match, create notification
      if (isMutual) {
        const notificationId = uuidv4();
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT INTO notifications (id, user_id, type, title, message, data)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            notificationId, 
            target_user_id, 
            'match', 
            'New Match!', 
            'You have a new roommate match',
            JSON.stringify({ match_id: match.id, user_id: req.userId })
          ], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      return res.json({ message: 'User liked', is_mutual: isMutual });
    }
  } catch (error) {
    console.error('Match action error:', error);
    res.status(500).json({ error: 'Failed to process match action' });
  }
});

// Get user's matches
router.get('/', async (req, res) => {
  try {
    const matches = await new Promise((resolve, reject) => {
      db.all(`
        SELECT m.*, 
               u1.name as user1_name, u1.profile_picture as user1_avatar,
               u2.name as user2_name, u2.profile_picture as user2_avatar
        FROM matches m
        JOIN users u1 ON m.user1_id = u1.id
        JOIN users u2 ON m.user2_id = u2.id
        WHERE (m.user1_id = ? OR m.user2_id = ?) AND m.is_mutual = TRUE
        ORDER BY m.created_at DESC
      `, [req.userId, req.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const processedMatches = matches.map(match => {
      const isCurrentUserUser1 = match.user1_id === req.userId;
      const otherUser = {
        id: isCurrentUserUser1 ? match.user2_id : match.user1_id,
        name: isCurrentUserUser1 ? match.user2_name : match.user1_name,
        avatar: isCurrentUserUser1 ? match.user2_avatar : match.user1_avatar
      };

      return {
        id: match.id,
        user: otherUser,
        matched_at: match.created_at
      };
    });

    res.json(processedMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// Get users who liked current user
router.get('/likes-me', async (req, res) => {
  try {
    const likes = await new Promise((resolve, reject) => {
      db.all(`
        SELECT m.*, u.id, u.name, u.age, u.profile_picture, u.location, u.occupation, u.bio
        FROM matches m
        JOIN users u ON (
          CASE 
            WHEN m.user1_id = ? THEN m.user2_id = u.id
            WHEN m.user2_id = ? THEN m.user1_id = u.id
          END
        )
        WHERE (
          (m.user1_id = ? AND m.user2_liked = TRUE AND m.user1_liked = FALSE) OR
          (m.user2_id = ? AND m.user1_liked = TRUE AND m.user2_liked = FALSE)
        )
        ORDER BY m.created_at DESC
      `, [req.userId, req.userId, req.userId, req.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(likes);
  } catch (error) {
    console.error('Get likes error:', error);
    res.status(500).json({ error: 'Failed to get likes' });
  }
});

// Calculate compatibility score between users
router.get('/compatibility/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get both users' data
    const [currentUser, targetUser] = await Promise.all([
      new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [req.userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
      new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      })
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate compatibility score based on various factors
    let score = 0;
    let factors = 0;

    // Location compatibility (30% weight)
    if (currentUser.location && targetUser.location) {
      if (currentUser.location.toLowerCase() === targetUser.location.toLowerCase()) {
        score += 30;
      } else if (currentUser.location.toLowerCase().includes(targetUser.location.toLowerCase()) ||
                 targetUser.location.toLowerCase().includes(currentUser.location.toLowerCase())) {
        score += 20;
      }
      factors += 30;
    }

    // Budget compatibility (25% weight)
    if (currentUser.budget && targetUser.budget) {
      const budgetDiff = Math.abs(currentUser.budget - targetUser.budget);
      const maxBudget = Math.max(currentUser.budget, targetUser.budget);
      const budgetCompatibility = Math.max(0, 1 - (budgetDiff / maxBudget));
      score += budgetCompatibility * 25;
      factors += 25;
    }

    // Age compatibility (15% weight)
    if (currentUser.age && targetUser.age) {
      const ageDiff = Math.abs(currentUser.age - targetUser.age);
      const ageCompatibility = Math.max(0, 1 - (ageDiff / 20)); // 20 year max difference
      score += ageCompatibility * 15;
      factors += 15;
    }

    // Lifestyle compatibility (20% weight)
    if (currentUser.lifestyle && targetUser.lifestyle) {
      try {
        const currentLifestyle = JSON.parse(currentUser.lifestyle);
        const targetLifestyle = JSON.parse(targetUser.lifestyle);
        
        let lifestyleMatches = 0;
        let lifestyleTotal = 0;

        const lifestyleKeys = ['smoking', 'pets', 'cleanliness', 'noise', 'guests'];
        lifestyleKeys.forEach(key => {
          if (currentLifestyle[key] && targetLifestyle[key]) {
            lifestyleTotal++;
            if (currentLifestyle[key] === targetLifestyle[key]) {
              lifestyleMatches++;
            }
          }
        });

        if (lifestyleTotal > 0) {
          score += (lifestyleMatches / lifestyleTotal) * 20;
        }
        factors += 20;
      } catch (e) {
        // Invalid JSON, skip lifestyle compatibility
      }
    }

    // Interests compatibility (10% weight)
    if (currentUser.interests && targetUser.interests) {
      try {
        const currentInterests = JSON.parse(currentUser.interests);
        const targetInterests = JSON.parse(targetUser.interests);
        
        const commonInterests = currentInterests.filter(interest => 
          targetInterests.includes(interest)
        );
        
        const totalInterests = new Set([...currentInterests, ...targetInterests]).size;
        if (totalInterests > 0) {
          score += (commonInterests.length / totalInterests) * 10;
        }
        factors += 10;
      } catch (e) {
        // Invalid JSON, skip interests compatibility
      }
    }

    // Normalize score
    const finalScore = factors > 0 ? Math.round((score / factors) * 100) : 50;

    res.json({
      compatibility_score: Math.max(0, Math.min(100, finalScore)),
      factors_considered: factors
    });
  } catch (error) {
    console.error('Calculate compatibility error:', error);
    res.status(500).json({ error: 'Failed to calculate compatibility' });
  }
});

module.exports = router;