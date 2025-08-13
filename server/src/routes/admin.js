const express = require('express');
const { User, Apartment, Match, Message } = require('../models');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      // Total users
      User.countDocuments(),
      // Total apartments
      Apartment.countDocuments(),
      // Total matches
      Match.countDocuments({ is_mutual: true }),
      // Total messages
      Message.countDocuments(),
      // New users this month
      User.countDocuments({
        created_at: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      // Active apartments
      Apartment.countDocuments({ status: 'active' })
    ]);

    res.json({
      total_users: stats[0],
      total_apartments: stats[1],
      total_matches: stats[2],
      total_messages: stats[3],
      new_users_this_month: stats[4],
      active_apartments: stats[5]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      };
    }

    const users = await User.find(filter)
      .select('-password_hash')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users,
      total: totalUsers,
      page: parseInt(page),
      pages: Math.ceil(totalUsers / parseInt(limit))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get additional stats for this user
    const [matchesCount, messagesCount, apartmentsCount] = await Promise.all([
      Match.countDocuments({
        $or: [{ user_id: id }, { target_user_id: id }]
      }),
      Message.countDocuments({ sender_id: id }),
      Apartment.countDocuments({ owner_id: id })
    ]);

    res.json({
      ...user.toObject(),
      stats: {
        matches_count: matchesCount,
        messages_count: messagesCount,
        apartments_count: apartmentsCount
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

// Update user verification status
router.put('/users/:id/verification', async (req, res) => {
  try {
    const { id } = req.params;
    const { email_verified, phone_verified } = req.body;

    const updateData = {};
    if (email_verified !== undefined) updateData.email_verified = email_verified;
    if (phone_verified !== undefined) updateData.phone_verified = phone_verified;

    await User.findByIdAndUpdate(id, updateData);

    res.json({ message: 'User verification status updated successfully' });
  } catch (error) {
    console.error('Update user verification error:', error);
    res.status(500).json({ error: 'Failed to update user verification' });
  }
});

// Ban/unban user
router.put('/users/:id/ban', async (req, res) => {
  try {
    const { id } = req.params;
    const { banned, ban_reason } = req.body;

    const updateData = {
      banned: banned,
      ban_reason: ban_reason || null,
      updated_at: new Date()
    };

    await User.findByIdAndUpdate(id, updateData);

    res.json({ message: banned ? 'User banned successfully' : 'User unbanned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to update user ban status' });
  }
});

// Get all apartments with pagination
router.get('/apartments', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const apartments = await Apartment.find(filter)
      .populate('owner_id', 'name email')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalApartments = await Apartment.countDocuments(filter);

    res.json({
      apartments,
      total: totalApartments,
      page: parseInt(page),
      pages: Math.ceil(totalApartments / parseInt(limit))
    });
  } catch (error) {
    console.error('Get apartments error:', error);
    res.status(500).json({ error: 'Failed to get apartments' });
  }
});

// Update apartment status
router.put('/apartments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await Apartment.findByIdAndUpdate(id, { 
      status, 
      updated_at: new Date() 
    });

    res.json({ message: 'Apartment status updated successfully' });
  } catch (error) {
    console.error('Update apartment status error:', error);
    res.status(500).json({ error: 'Failed to update apartment status' });
  }
});

// Delete apartment
router.delete('/apartments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Apartment.findByIdAndDelete(id);

    res.json({ message: 'Apartment deleted successfully' });
  } catch (error) {
    console.error('Delete apartment error:', error);
    res.status(500).json({ error: 'Failed to delete apartment' });
  }
});

// Get recent activity
router.get('/activity', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent users
    const recentUsers = await User.find()
      .select('name email created_at')
      .sort({ created_at: -1 })
      .limit(parseInt(limit) / 2);

    // Get recent apartments
    const recentApartments = await Apartment.find()
      .populate('owner_id', 'name')
      .select('title owner_id created_at')
      .sort({ created_at: -1 })
      .limit(parseInt(limit) / 2);

    // Combine and sort by creation date
    const activity = [
      ...recentUsers.map(user => ({
        type: 'user_registration',
        data: { name: user.name, email: user.email },
        created_at: user.created_at
      })),
      ...recentApartments.map(apartment => ({
        type: 'apartment_listing',
        data: { title: apartment.title, owner: apartment.owner_id?.name },
        created_at: apartment.created_at
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(activity.slice(0, parseInt(limit)));
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

module.exports = router;