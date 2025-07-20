const express = require('express');
const { getDatabase } = require('../database/init');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const db = getDatabase();

// Apply admin middleware to all routes
router.use(requireAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      // Total users
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      }),
      // Total apartments
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM apartments', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      }),
      // Total matches
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM matches WHERE is_mutual = TRUE', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      }),
      // Pending reports
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM reports WHERE status = "open"', (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      }),
      // New users this week
      new Promise((resolve, reject) => {
        db.get(`
          SELECT COUNT(*) as count FROM users 
          WHERE created_at >= datetime('now', '-7 days')
        `, (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      })
    ]);

    res.json({
      total_users: stats[0],
      total_apartments: stats[1],
      total_matches: stats[2],
      pending_reports: stats[3],
      new_users_this_week: stats[4]
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to get admin stats' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      if (status === 'verified') {
        query += ' AND email_verified = TRUE AND phone_verified = TRUE';
      } else if (status === 'unverified') {
        query += ' AND (email_verified = FALSE OR phone_verified = FALSE)';
      }
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const users = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Remove sensitive data
    const sanitizedUsers = users.map(user => {
      delete user.password_hash;
      return user;
    });

    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get all apartments with pagination
router.get('/apartments', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT a.*, u.name as owner_name, u.email as owner_email
      FROM apartments a
      JOIN users u ON a.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status === 'pending') {
      query += ' AND a.verified = FALSE';
    } else if (status === 'verified') {
      query += ' AND a.verified = TRUE';
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const apartments = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(apartments);
  } catch (error) {
    console.error('Get admin apartments error:', error);
    res.status(500).json({ error: 'Failed to get apartments' });
  }
});

// Get all reports
router.get('/reports', async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT r.*, 
             u1.name as reporter_name, u1.email as reporter_email,
             u2.name as reported_user_name, u2.email as reported_user_email,
             a.title as reported_apartment_title
      FROM reports r
      JOIN users u1 ON r.reporter_id = u1.id
      LEFT JOIN users u2 ON r.reported_user_id = u2.id
      LEFT JOIN apartments a ON r.reported_apartment_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const reports = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(reports);
  } catch (error) {
    console.error('Get admin reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Update user status
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'ban', 'unban', 'verify', 'delete'

    if (!['ban', 'unban', 'verify', 'delete'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    if (action === 'delete') {
      await new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else if (action === 'verify') {
      await new Promise((resolve, reject) => {
        db.run(`
          UPDATE users 
          SET email_verified = TRUE, phone_verified = TRUE, verification_status = 'verified'
          WHERE id = ?
        `, [userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      const status = action === 'ban' ? 'banned' : 'active';
      await new Promise((resolve, reject) => {
        db.run('UPDATE users SET verification_status = ? WHERE id = ?', [status, userId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    res.json({ message: `User ${action} successful` });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Verify/reject apartment
router.put('/apartments/:apartmentId/verify', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    const { action } = req.body; // 'approve', 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    if (action === 'approve') {
      await new Promise((resolve, reject) => {
        db.run('UPDATE apartments SET verified = TRUE WHERE id = ?', [apartmentId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      await new Promise((resolve, reject) => {
        db.run('UPDATE apartments SET verified = FALSE, active = FALSE WHERE id = ?', [apartmentId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    res.json({ message: `Apartment ${action} successful` });
  } catch (error) {
    console.error('Verify apartment error:', error);
    res.status(500).json({ error: 'Failed to verify apartment' });
  }
});

// Update report status
router.put('/reports/:reportId/status', async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body; // 'investigating', 'resolved', 'dismissed'

    if (!['investigating', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const resolvedAt = ['resolved', 'dismissed'].includes(status) ? new Date().toISOString() : null;

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE reports 
        SET status = ?, resolved_at = ?
        WHERE id = ?
      `, [status, resolvedAt, reportId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: 'Report status updated successfully' });
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
});

module.exports = router;