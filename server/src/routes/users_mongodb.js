const express = require('express');
const bcrypt = require('bcryptjs');
const { User, UserPhoto } = require('../models');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password_hash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user photos
    const photos = await UserPhoto.find({ user_id: req.userId }).sort({ order_index: 1 });

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
      updated_at: user.updated_at,
      photos: photos.map(photo => ({
        id: photo._id,
        url: photo.photo_url,
        is_primary: photo.is_primary,
        order_index: photo.order_index
      }))
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.email;
    delete updateData.password_hash;
    delete updateData.role;
    
    // Set updated timestamp
    updateData.updated_at = new Date();

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get all users for roommate discovery (with filters)
router.get('/', async (req, res) => {
  try {
    const {
      location,
      age_min,
      age_max,
      budget_min,
      budget_max,
      gender,
      verification_status,
      limit = 50,
      skip = 0
    } = req.query;

    // Build filter query
    const filter = {
      _id: { $ne: req.userId }, // Exclude current user
      verification_status: { $ne: 'banned' }
    };

    // Add filters if provided
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (age_min || age_max) {
      filter.age = {};
      if (age_min) filter.age.$gte = parseInt(age_min);
      if (age_max) filter.age.$lte = parseInt(age_max);
    }
    
    if (budget_min || budget_max) {
      filter.budget = {};
      if (budget_min) filter.budget.$gte = parseInt(budget_min);
      if (budget_max) filter.budget.$lte = parseInt(budget_max);
    }
    
    if (gender) {
      filter.gender = gender;
    }
    
    if (verification_status) {
      filter.verification_status = verification_status;
    }

    const users = await User.find(filter)
      .select('-password_hash -email') // Exclude sensitive data
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ created_at: -1 });

    // Get photos for each user
    const usersWithPhotos = await Promise.all(users.map(async (user) => {
      const photos = await UserPhoto.find({ user_id: user._id })
        .sort({ order_index: 1 })
        .limit(5); // Limit photos for performance

      return {
        id: user._id,
        name: user.name,
        age: user.age,
        nationality: user.nationality,
        profile_picture: user.profile_picture,
        budget: user.budget,
        location: user.location,
        move_in_date: user.move_in_date,
        bio: user.bio,
        interests: user.interests || [],
        verification_status: user.verification_status,
        lifestyle: user.lifestyle || {},
        photos: photos.map(photo => ({
          id: photo._id,
          url: photo.photo_url,
          is_primary: photo.is_primary
        }))
      };
    }));

    res.json(usersWithPhotos);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get specific user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password_hash -email'); // Exclude sensitive data

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user photos
    const photos = await UserPhoto.find({ user_id: userId }).sort({ order_index: 1 });

    const userResponse = {
      id: user._id,
      name: user.name,
      age: user.age,
      nationality: user.nationality,
      profile_picture: user.profile_picture,
      budget: user.budget,
      location: user.location,
      move_in_date: user.move_in_date,
      bio: user.bio,
      interests: user.interests || [],
      languages: user.languages || [],
      lifestyle: user.lifestyle || {},
      roommate_preferences: user.roommate_preferences || {},
      verification_status: user.verification_status,
      photos: photos.map(photo => ({
        id: photo._id,
        url: photo.photo_url,
        is_primary: photo.is_primary,
        order_index: photo.order_index
      }))
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Search users
router.get('/search', async (req, res) => {
  try {
    const { q, location, age_min, age_max } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const filter = {
      _id: { $ne: req.userId },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
        { occupation: { $regex: q, $options: 'i' } },
        { interests: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    // Add additional filters
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (age_min || age_max) {
      filter.age = {};
      if (age_min) filter.age.$gte = parseInt(age_min);
      if (age_max) filter.age.$lte = parseInt(age_max);
    }

    const users = await User.find(filter)
      .select('name age location bio interests verification_status profile_picture')
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Update password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    // Get current user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(req.userId, {
      password_hash: hashedPassword,
      updated_at: new Date()
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Delete user account
router.delete('/', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password confirmation is required' });
    }

    // Get current user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // Delete user and related data
    await Promise.all([
      User.findByIdAndDelete(req.userId),
      UserPhoto.deleteMany({ user_id: req.userId }),
      // Note: In production, you might want to anonymize rather than delete for data integrity
    ]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

module.exports = router;