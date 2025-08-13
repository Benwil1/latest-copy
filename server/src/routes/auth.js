const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User, VerificationCode } = require('../models');
const { validateRequest, schemas } = require('../middleware/validation');
const { sendVerificationEmail, sendVerificationSMS, verifyPhoneCode } = require('../services/notification');

const router = express.Router();

// Register
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { name, email, phone, password, country, nationality, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const newUser = new User({
      _id: userId,
      name,
      email,
      phone,
      password_hash: hashedPassword,
      country,
      nationality,
      location
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Generate email verification code
    const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save email verification code
    const emailVerificationCode = new VerificationCode({
      _id: uuidv4(),
      user_id: userId,
      code: emailCode,
      type: 'email',
      expires_at: expiresAt
    });

    await emailVerificationCode.save();

    // Send verification codes
    try {
      await sendVerificationSMS(phone); // Twilio Verify handles code generation
      await sendVerificationEmail(email, emailCode, name);
    } catch (error) {
      console.error('Failed to send verification codes:', error);
      // Continue anyway - user can request resend
    }

    // Return user data (excluding sensitive information)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      email_verified: newUser.email_verified,
      phone_verified: newUser.phone_verified,
      country: newUser.country,
      location: newUser.location
    };

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user response (excluding sensitive data)
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
      two_factor_enabled: user.two_factor_enabled,
      role: user.role,
      profile_picture: user.profile_picture,
      country: user.country,
      nationality: user.nationality,
      location: user.location,
      age: user.age,
      gender: user.gender,
      occupation: user.occupation,
      bio: user.bio,
      interests: user.interests || [],
      languages: user.languages || [],
      budget: user.budget,
      preferred_location: user.preferred_location,
      move_in_date: user.move_in_date,
      space_type: user.space_type,
      bathroom_preference: user.bathroom_preference,
      furnished_preference: user.furnished_preference,
      amenities: user.amenities || [],
      lifestyle: user.lifestyle || {},
      roommate_preferences: user.roommate_preferences || {},
      verification_status: user.verification_status,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
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

    if (type === 'phone') {
      // For phone verification, use Twilio Verify API
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPhone = await verifyPhoneCode(user.phone, code);
      if (!isValidPhone) {
        return res.status(400).json({ error: 'Invalid phone verification code' });
      }

      // Update user phone verification status
      await User.findByIdAndUpdate(userId, { phone_verified: true });

      res.json({ message: 'Phone verified successfully' });
    } else if (type === 'email') {
      // In development, optionally accept any 6-digit code when email provider isn't configured
      const allowDevAny = String(process.env.ALLOW_DEV_VERIFICATION_ANY_CODE || '').toLowerCase() === 'true' || !process.env.SENDGRID_API_KEY;
      if (allowDevAny) {
        if (!/^\d{6}$/.test(code)) {
          return res.status(400).json({ error: 'Invalid verification code format' });
        }
        await User.findByIdAndUpdate(userId, { email_verified: true });
        return res.json({ message: 'Email verified successfully' });
      }

      // For email verification, use traditional code verification
      const verificationCode = await VerificationCode.findOne({
        user_id: userId,
        code: code,
        type: type,
        used: false,
        expires_at: { $gt: new Date() }
      });

      if (!verificationCode) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Mark code as used
      await VerificationCode.findByIdAndUpdate(verificationCode._id, { used: true });

      // Update user email verification status
      await User.findByIdAndUpdate(userId, { email_verified: true });

      res.json({ message: 'Email verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid verification type' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { type } = req.body;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (type === 'phone') {
      await sendVerificationSMS(user.phone);
    } else if (type === 'email') {
      // Generate new email verification code
      const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save new verification code
      const verificationCode = new VerificationCode({
        _id: uuidv4(),
        user_id: userId,
        code: emailCode,
        type: 'email',
        expires_at: expiresAt
      });

      await verificationCode.save();
      await sendVerificationEmail(user.email, emailCode, user.name);
    }

    res.json({ message: `${type} verification code sent successfully` });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification code' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save reset code
    const verificationCode = new VerificationCode({
      _id: uuidv4(),
      user_id: user._id,
      code: resetCode,
      type: 'password_reset',
      expires_at: expiresAt
    });

    await verificationCode.save();

    // Send reset email
    await sendVerificationEmail(email, resetCode, user.name, 'password_reset');

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;