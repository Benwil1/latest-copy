const express = require('express');
const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/init');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();
const db = getDatabase();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user photos
    const photos = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM user_photos WHERE user_id = ? ORDER BY order_index', [req.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      ...user,
      photos,
      interests: user.interests ? JSON.parse(user.interests) : [],
      languages: user.languages ? JSON.parse(user.languages) : [],
      amenities: user.amenities ? JSON.parse(user.amenities) : [],
      lifestyle: user.lifestyle ? JSON.parse(user.lifestyle) : {},
      roommate_preferences: user.roommate_preferences ? JSON.parse(user.roommate_preferences) : {}
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', validateRequest(schemas.updateProfile), async (req, res) => {
  try {
    const updates = req.body;
    
    // Convert arrays and objects to JSON strings
    if (updates.interests) updates.interests = JSON.stringify(updates.interests);
    if (updates.languages) updates.languages = JSON.stringify(updates.languages);
    if (updates.amenities) updates.amenities = JSON.stringify(updates.amenities);
    if (updates.lifestyle) updates.lifestyle = JSON.stringify(updates.lifestyle);
    if (updates.roommate_preferences) updates.roommate_preferences = JSON.stringify(updates.roommate_preferences);

    // Build dynamic update query
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map(field => `${field} = ?`).join(', ');

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, req.userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user by ID (for viewing other profiles)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await new Promise((resolve, reject) => {
      db.get(`
        SELECT id, name, age, gender, occupation, location, bio, interests, 
               languages, budget, preferred_location, move_in_date, space_type,
               bathroom_preference, furnished_preference, amenities, lifestyle,
               roommate_preferences, profile_picture, email_verified, phone_verified,
               created_at
        FROM users WHERE id = ?
      `, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user photos
    const photos = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM user_photos WHERE user_id = ? ORDER BY order_index', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      ...user,
      photos,
      interests: user.interests ? JSON.parse(user.interests) : [],
      languages: user.languages ? JSON.parse(user.languages) : [],
      amenities: user.amenities ? JSON.parse(user.amenities) : [],
      lifestyle: user.lifestyle ? JSON.parse(user.lifestyle) : {},
      roommate_preferences: user.roommate_preferences ? JSON.parse(user.roommate_preferences) : {}
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Search users (for roommate matching)
router.get('/', async (req, res) => {
  try {
    const {
      location,
      min_budget,
      max_budget,
      min_age,
      max_age,
      gender,
      space_type,
      lifestyle_preferences,
      page = 1,
      limit = 20
    } = req.query;

    let query = `
      SELECT id, name, age, gender, occupation, location, bio, interests,
             budget, preferred_location, space_type, lifestyle, profile_picture,
             email_verified, phone_verified
      FROM users 
      WHERE id != ? AND email_verified = TRUE AND phone_verified = TRUE
    `;
    const params = [req.userId];

    // Add filters
    if (location) {
      query += ' AND (location LIKE ? OR preferred_location LIKE ?)';
      params.push(`%${location}%`, `%${location}%`);
    }

    if (min_budget) {
      query += ' AND budget >= ?';
      params.push(parseInt(min_budget));
    }

    if (max_budget) {
      query += ' AND budget <= ?';
      params.push(parseInt(max_budget));
    }

    if (min_age) {
      query += ' AND age >= ?';
      params.push(parseInt(min_age));
    }

    if (max_age) {
      query += ' AND age <= ?';
      params.push(parseInt(max_age));
    }

    if (gender) {
      query += ' AND gender = ?';
      params.push(gender);
    }

    if (space_type) {
      query += ' AND space_type = ?';
      params.push(space_type);
    }

    // Add pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const users = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Parse JSON fields
    const processedUsers = users.map(user => ({
      ...user,
      interests: user.interests ? JSON.parse(user.interests) : [],
      lifestyle: user.lifestyle ? JSON.parse(user.lifestyle) : {}
    }));

    res.json(processedUsers);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Change password
router.put('/password', async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    // Get current password hash
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT password_hash FROM users WHERE id = ?', [req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
        [newPasswordHash, req.userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete account
router.delete('/account', async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [req.userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;