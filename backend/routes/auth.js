import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

const validateEmailFormat = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

const validatePasswordStrength = (password) => {
  return password.length >= 6;
};

router.post('/signup', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!validateEmailFormat(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!validatePasswordStrength(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstname: firstName,
      lastname: lastName,
      username,
      email,
      password: hashedPassword,
      hasSelectedInterests: false,
    });
    return res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred during signup' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, hasSelectedInterests: user.hasSelectedInterests },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.status(200).json({
      message: 'Login successful',
      token,
      hasSelectedInterests: user.hasSelectedInterests,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

export default router;

