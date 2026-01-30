import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from '../services/emailService.js';

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
  isEmailVerified: user.isEmailVerified
});

// Debug endpoint to check email configuration
router.get('/debug/email-config', (req, res) => {
  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASSWORD || '').trim();
  
  return res.json({
    emailUser: emailUser ? '✓ Set' : '✗ Missing',
    emailPassLength: emailPass?.length || 0,
    emailPassPreview: emailPass ? emailPass.substring(0, 5) + '...' : 'Missing',
    environment: process.env.NODE_ENV
  });
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, age, gender } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
      age: age ? Number(age) : undefined,
      gender,
      isEmailVerified: false, // Temporary: will enable after email setup works
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    // Try to send verification email (but don't block registration if it fails)
    try {
      const emailSent = await sendVerificationEmail(newUser.email, newUser.username, verificationToken);
      console.log('📧 Verification email sent:', emailSent);
    } catch (emailErr) {
      console.error('📧 Email sending error (non-blocking):', emailErr.message);
      // Don't block registration
    }

    const token = signToken(newUser._id.toString());

    return res.status(201).json({
      message: 'Registration successful! Attempting to send verification email...',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error while registering.' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username);

    return res.status(200).json({
      message: 'Email verified successfully! Your account is now active.',
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Email verification error:', err);
    return res.status(500).json({ message: 'Server error while verifying email.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Temporary: Allow login even if email not verified (for testing)
    // TODO: Re-enable email verification check after email setup is working
    // if (!user.isEmailVerified) {
    //   return res.status(403).json({ 
    //     message: 'Please verify your email before logging in. Check your inbox for the verification link.',
    //     needsEmailVerification: true
    //   });
    // }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id.toString());

    return res.status(200).json({
      token,
      user: sanitizeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error while logging in.' });
  }
});

export default router;
