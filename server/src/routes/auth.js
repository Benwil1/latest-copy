const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { validateRequest, schemas } = require('../middleware/validation');
const { sendVerificationEmail, sendVerificationSMS } = require('../services/notification');

const router = express.Router();
const db = getDatabase();

// Register
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { name, email, phone, password, country, nationality, location } = req.body;

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (
          id, email, password_hash, name, phone, country, nationality, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, email, passwordHash, name, phone, country, nationality, location], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    // Generate verification codes
    const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save verification codes
    await Promise.all([
      new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO verification_codes (id, user_id, code, type, expires_at)
          VALUES (?, ?, ?, ?, ?)
        `, [uuidv4(), userId, phoneCode, 'phone', expiresAt.toISOString()], (err) => {
          if (err) reject(err);
          else resolve();
        });
      }),
      new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO verification_codes (id, user_id, code, type, expires_at)
          VALUES (?, ?, ?, ?, ?)
        `, [uuidv4(), userId, emailCode, 'email', expiresAt.toISOString()], (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
    ]);

    // Send verification codes
    try {
      await sendVerificationSMS(phone, phoneCode);
      await sendVerificationEmail(email, emailCode, name);
    } catch (error) {
      console.error('Failed to send verification codes:', error);
      // Continue anyway - user can request resend
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        phone,
        email_verified: false,
        phone_verified: false,
        country,
        nationality,
        location
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login
router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove sensitive data
    delete user.password_hash;

    res.json({
      message: 'Login successful',
      token,
      user: {
        ...user,
        interests: user.interests ? JSON.parse(user.interests) : [],
        languages: user.languages ? JSON.parse(user.languages) : [],
        amenities: user.amenities ? JSON.parse(user.amenities) : [],
        lifestyle: user.lifestyle ? JSON.parse(user.lifestyle) : {},
        roommate_preferences: user.roommate_preferences ? JSON.parse(user.roommate_preferences) : {}
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify phone/email
router.post('/verify', validateRequest(schemas.verifyCode), async (req, res) => {
  try {
    const { code, type } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Check verification code
    const verificationCode = await new Promise((resolve, reject) => {
      db.get(`
        SELECT * FROM verification_codes 
        WHERE user_id = ? AND code = ? AND type = ? AND used = FALSE AND expires_at > datetime('now')
      `, [userId, code, type], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!verificationCode) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Mark code as used
    await new Promise((resolve, reject) => {
      db.run('UPDATE verification_codes SET used = TRUE WHERE id = ?', [verificationCode.id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Update user verification status
    const field = type === 'email' ? 'email_verified' : 'phone_verified';
    await new Promise((resolve, reject) => {
      db.run(`UPDATE users SET ${field} = TRUE WHERE id = ?`, [userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: `${type} verified successfully` });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend verification code
router.post('/resend-verification', async (req, res) => {
  try {
    const { type } = req.body; // 'email' or 'phone'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get user details
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT email, phone, name FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save verification code
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO verification_codes (id, user_id, code, type, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `, [uuidv4(), userId, code, type, expiresAt.toISOString()], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Send verification code
    if (type === 'email') {
      await sendVerificationEmail(user.email, code, user.name);
    } else if (type === 'phone') {
      await sendVerificationSMS(user.phone, code);
    }

    res.json({ message: `Verification code sent to ${type}` });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, name FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save reset code
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO verification_codes (id, user_id, code, type, expires_at)
        VALUES (?, ?, ?, ?, ?)
      `, [uuidv4(), user.id, resetCode, 'password_reset', expiresAt.toISOString()], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Send reset email
    await sendVerificationEmail(email, resetCode, user.name, 'password_reset');

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to process password reset' });
  }
});

module.exports = router;