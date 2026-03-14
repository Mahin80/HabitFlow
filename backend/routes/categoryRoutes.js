// routes/categoryRoutes.js
import express from 'express';
import { Category } from '../models/Category.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Request received for /api/categories');
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;

