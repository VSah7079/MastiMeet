// Authentication middleware
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const decoded = jwt.verify(token, secret);

    req.userId = decoded.sub;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again',
        isExpired: true
      });
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.sub;
    }

    next();
  } catch (err) {
    // Silently fail for optional auth
    next();
  }
};

export const requireRole = (allowedRoles = []) => async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.userId).select('role');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const normalizedRole = (user.role || 'user').toLowerCase();
    const normalizedAllowed = allowedRoles.map((role) => role.toLowerCase());

    if (!normalizedAllowed.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    req.userRole = normalizedRole;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error'
    });
  }
};
