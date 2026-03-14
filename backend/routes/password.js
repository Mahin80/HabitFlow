import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Username not found' });
    return res.status(200).json({ message: 'Username found. You can reset your password.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing your request' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Username not found' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating password' });
  }
});

export default router;