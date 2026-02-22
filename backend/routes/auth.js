import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from '../services/emailService.js';
import { validateRegistration, validateLogin, validateVerifyEmail, sanitizeInput } from '../middleware/validation.js';
import createRateLimiter from '../middleware/rateLimiter.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  age: user.age,
  gender: user.gender,
  bio: user.bio || '',
  isEmailVerified: user.isEmailVerified,
  role: user.role || 'user'
});

// Debug endpoint
router.get('/debug/email-config', (req, res) => {
  return res.json({ success: true, environment: process.env.NODE_ENV });
});

// Register
router.post('/register', createRateLimiter('register'), validateRegistration, async (req, res) => {
  try {
    const { username, email, password, age, gender } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase() : null;
    const role = adminEmail && adminEmail === String(email).toLowerCase() ? 'admin' : 'user';

    const newUser = await User.create({
      username, email, passwordHash, age: age ? Number(age) : undefined, gender, role,
      isEmailVerified: false, emailVerificationToken: verificationToken, emailVerificationExpires: verificationExpires
    });

    try {
      await sendVerificationEmail(newUser.email, newUser.username, verificationToken);
    } catch (emailErr) {
      console.error('Email error:', emailErr.message);
    }

    const token = signToken(newUser._id.toString());
    return res.status(201).json({ success: true, message: 'Registration successful!', token, user: sanitizeUser(newUser) });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Verify email
router.post('/verify-email', createRateLimiter('verifyEmail'), validateVerifyEmail, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (err) {
      console.error('Welcome email error:', err);
    }

    return res.status(200).json({ success: true, message: 'Email verified!', user: sanitizeUser(user) });
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// Login
router.post('/login', createRateLimiter('login'), validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email', needsEmailVerification: true });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(user._id.toString());
    return res.status(200).json({ success: true, message: 'Login successful!', token, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { username, age, gender, bio } = req.body;
    const errors = {};

    if (username) {
      if (username.length < 3 || username.length > 20) errors.username = 'Username must be 3-20 chars';
      if (!/^[a-zA-Z0-9_]+$/.test(username)) errors.username = 'Only letters, numbers, underscores';
    }
    if (age && (age < 18 || age > 120)) errors.age = 'Age must be 18-120';
    if (gender && !['male', 'female', 'other', 'prefer-not-to-say'].includes(gender.toLowerCase())) errors.gender = 'Invalid gender';
    if (bio && bio.length > 500) errors.bio = 'Bio must be 500 chars or less';

    if (Object.keys(errors).length > 0) return res.status(400).json({ success: false, message: 'Validation failed', errors });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (username) user.username = sanitizeInput(username);
    if (age) user.age = Number(age);
    if (gender) user.gender = sanitizeInput(gender).toLowerCase();
    if (bio) user.bio = sanitizeInput(bio);

    await user.save();
    return res.status(200).json({ success: true, message: 'Profile updated!', user: sanitizeUser(user) });
  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// Delete account
router.delete('/delete-account', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) return res.status(401).json({ success: false, message: 'Invalid password' });

    await User.findByIdAndDelete(req.userId);
    return res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ success: false, message: 'Deletion failed' });
  }
});

export default router;
