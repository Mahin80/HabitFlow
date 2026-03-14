import express from 'express';
import { User } from '../models/User.js';
import { UserInterest } from '../models/UserInterest.js';
import { Interest } from '../models/Interest.js';

const router = express.Router();

router.post('/save', async (req, res) => {
  const { userId, selectedInterests } = req.body;
  if (!userId || !Array.isArray(selectedInterests) || selectedInterests.length === 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const normalizedInterests = [...new Set(
    selectedInterests
      .filter((value) => typeof value === 'string')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
  )];

  if (normalizedInterests.length === 0) {
    return res.status(400).json({ message: 'No valid interests provided' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.hasSelectedInterests) return res.status(400).json({ message: 'Interests have already been selected.' });

    const existingInterests = await Interest.find({ interestName: { $in: normalizedInterests } }).select('_id interestName');
    const existingNames = new Set(existingInterests.map((interest) => interest.interestName));
    const missingNames = normalizedInterests.filter((interestName) => !existingNames.has(interestName));

    let createdInterests = [];
    if (missingNames.length > 0) {
      createdInterests = await Interest.insertMany(
        missingNames.map((interestName) => ({ interestName })),
        { ordered: false }
      );
    }

    const interests = [...existingInterests, ...createdInterests];

    const userInterests = interests.map((interest) => ({ userId, interestId: interest._id }));
    await UserInterest.insertMany(userInterests);
    user.hasSelectedInterests = true;
    await user.save();
    res.status(201).json({ message: 'Interests saved successfully!' });
  } catch (error) {
    console.error('Error saving interests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;