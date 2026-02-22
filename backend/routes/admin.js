import express from 'express';
import User from '../models/User.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware, requireRole(['admin']));

router.get('/summary', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      verifiedUsers,
      pendingUsers,
      admins,
      moderators,
      newUsers7d
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isEmailVerified: true }),
      User.countDocuments({ isEmailVerified: false }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'moderator' }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalUsers,
        verifiedUsers,
        pendingUsers,
        admins,
        moderators,
        newUsers7d
      }
    });
  } catch (err) {
    console.error('Admin summary error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load summary' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { query, role, status, limit = 50 } = req.query;
    const filters = {};

    if (query) {
      filters.$or = [
        { username: { $regex: String(query), $options: 'i' } },
        { email: { $regex: String(query), $options: 'i' } }
      ];
    }

    if (role && role !== 'All') {
      filters.role = String(role).toLowerCase();
    }

    if (status && status !== 'All') {
      if (status === 'Active') filters.isEmailVerified = true;
      if (status === 'Pending') filters.isEmailVerified = false;
    }

    const users = await User.find(filters)
      .sort({ updatedAt: -1 })
      .limit(Number(limit))
      .select('username email role isEmailVerified updatedAt');

    const result = users.map((user) => {
      const roleLabel = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
      const statusLabel = user.isEmailVerified ? 'Active' : 'Pending';
      return {
        id: user._id,
        name: user.username,
        email: user.email,
        role: roleLabel,
        status: statusLabel,
        lastSeen: user.updatedAt
      };
    });

    return res.status(200).json({ success: true, users: result });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load users' });
  }
});

export default router;
