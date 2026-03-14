import express from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:userId', async (req, res) => {
    const { firstname, lastname, username, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }
        user.firstname = firstname;
        user.lastname = lastname;
        user.username = username;
        if (newPassword) user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Account settings updated successfully' });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;