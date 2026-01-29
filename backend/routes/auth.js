import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
  gender: user.gender
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

    const newUser = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
      age: age ? Number(age) : undefined,
      gender
    });

    const token = signToken(newUser._id.toString());

    return res.status(201).json({
      token,
      user: sanitizeUser(newUser)
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error while registering.' });
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
