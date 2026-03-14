import express from 'express';
import { ContactFeedback } from '../models/ContactFeedback.js';

const router = express.Router();

router.post('/contactForm', async (req, res) => {
  try {
    const { name, email, thoughts } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }
    const feedback = await ContactFeedback.create({ name, email, thoughts });
    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;

