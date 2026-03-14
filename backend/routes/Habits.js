import express from 'express';
import { Habit } from '../models/Habit.js';
import { HabitProgress } from '../models/HabitProgress.js';
import { Goal } from '../models/Goal.js';

const router = express.Router();

// Get habits by frequency with progress and goals
router.get('/:frequency', async (req, res) => {
  const { userId } = req.query;
  const { frequency } = req.params;
  try {
    const habits = await Habit.find({ userId, frequency });
    const habitIds = habits.map((h) => h._id);

    const [progresses, goals] = await Promise.all([
      HabitProgress.find({ userId, habitId: { $in: habitIds } }),
      Goal.find({ userId, habitId: { $in: habitIds } }),
    ]);

    const result = habits.map((habit) => {
      const habitObj = habit.toJSON();
      habitObj.HabitProgresses = progresses
        .filter((p) => p.habitId.equals(habit._id))
        .map((p) => p.toJSON());
      habitObj.Goal = goals.find((g) => g.habitId.equals(habit._id))?.toJSON() || null;
      return habitObj;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching habits and goals:', error);
    res.status(500).json({ message: 'Error fetching habits and goals' });
  }
});

// Create a new habit
router.post('/createhabit', async (req, res) => {
  console.log('Request received at /createhabit:', req.body);
  const { userId, habitName, description, frequency, categoryId } = req.body;

  try {
    const startDateObj = new Date();
    let nextDueDate;
    if (frequency === 'daily') {
      nextDueDate = new Date(startDateObj);
      nextDueDate.setDate(startDateObj.getDate() + 1);
    } else if (frequency === 'weekly') {
      nextDueDate = new Date(startDateObj);
      nextDueDate.setDate(startDateObj.getDate() + 7);
    } else if (frequency === 'monthly') {
      nextDueDate = new Date(startDateObj);
      nextDueDate.setMonth(startDateObj.getMonth() + 1);
    }

    if (!nextDueDate || isNaN(nextDueDate)) {
      return res.status(400).json({ message: 'Calculated nextDueDate is invalid.' });
    }

    const newHabit = await Habit.create({
      userId,
      habitName,
      description,
      frequency,
      categoryId,
      startDate: startDateObj,
      nextDueDate,
    });

    const today = new Date().toISOString().split('T')[0];
    const existingProgress = await HabitProgress.findOne({
      userId,
      habitId: newHabit._id,
      completionDate: {
        $gte: new Date(today + 'T00:00:00Z'),
        $lte: new Date(today + 'T23:59:59Z'),
      },
    });

    if (!existingProgress) {
      await HabitProgress.create({
        userId,
        habitId: newHabit._id,
        completionDate: new Date(today),
        isCompleted: false,
      });
    }

    console.log('Habit created:', newHabit);
    return res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return res.status(500).json({ message: 'Failed to create habit.', error: error.message });
  }
});

// Update progress
router.post('/update-progress', async (req, res) => {
  const { userId, habitId, date, progress } = req.body;
  console.log('Data received:', req.body);

  try {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const existingProgress = await HabitProgress.findOne({
      userId,
      habitId,
      completionDate: {
        $gte: new Date(formattedDate + 'T00:00:00Z'),
        $lte: new Date(formattedDate + 'T23:59:59Z'),
      },
    });

    if (existingProgress) {
      existingProgress.isCompleted = progress;
      await existingProgress.save();
      return res.status(200).json({ message: 'Progress updated successfully!' });
    } else {
      await HabitProgress.create({
        userId,
        habitId,
        completionDate: new Date(formattedDate),
        isCompleted: progress,
      });
      return res.status(201).json({ message: 'New progress record created!' });
    }
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({ message: 'Failed to update progress.' });
  }
});

// Get all habits with goals for a user
router.get('/all', async (req, res) => {
  const { userId } = req.query;
  try {
    const habits = await Habit.find({ userId });
    const habitIds = habits.map((h) => h._id);
    const goals = await Goal.find({ habitId: { $in: habitIds } });

    const result = habits.map((h) => {
      const habitObj = h.toJSON();
      habitObj.Goal = goals.find((g) => g.habitId.equals(h._id))?.toJSON() || null;
      return habitObj;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching habits with goals:', error);
    return res.status(500).json({ message: 'Failed to fetch habits with goals.' });
  }
});

// Delete completed habits for a user
router.post('/delete-completed-habits', async (req, res) => {
  const { userId } = req.body;
  try {
    await Habit.deleteMany({ userId });
    return res.status(200).json({ message: 'Completed habits deleted successfully.' });
  } catch (error) {
    console.error('Error deleting completed habits:', error);
    return res.status(500).json({ message: 'Failed to delete completed habits.' });
  }
});

// Get all habits for a user
router.get('/getAllHabits/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const habits = await Habit.find({ userId });
    if (habits.length === 0) {
      return res.status(404).json({ message: 'No habits found for this user.' });
    }
    return res.status(200).json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return res.status(500).json({ message: 'Failed to fetch habits.' });
  }
});

// Get details of a specific habit
router.get('/habitDetails/:habitId', async (req, res) => {
  const { habitId } = req.params;
  try {
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }
    return res.status(200).json(habit);
  } catch (error) {
    console.error('Error fetching habit details:', error);
    return res.status(500).json({ message: 'Failed to fetch habit details.' });
  }
});

// Update a habit
router.put('/updatehabit/:habitId', async (req, res) => {
  const { habitId } = req.params;
  const { habitName, description, frequency, categoryId } = req.body;
  try {
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }
    if (habitName) habit.habitName = habitName;
    if (description) habit.description = description;
    if (frequency) habit.frequency = frequency;
    if (categoryId) habit.categoryId = categoryId;
    await habit.save();
    return res.status(200).json({ message: 'Habit updated successfully.', habit });
  } catch (error) {
    console.error('Error updating habit:', error);
    return res.status(500).json({ message: 'Failed to update habit.' });
  }
});

// Delete a habit
router.delete('/deletehabit/:habitId', async (req, res) => {
  const { habitId } = req.params;
  try {
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }
    await Goal.deleteMany({ habitId });
    await habit.deleteOne();
    return res.status(200).json({ message: 'Habit deleted successfully.' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return res.status(500).json({ message: 'Failed to delete habit.' });
  }
});

// Set a goal for a habit
router.post('/setGoal/:habitId/:userId', async (req, res) => {
  const { habitId, userId } = req.params;
  console.log('habitId==', habitId);
  const { goal, progressTrack } = req.body;
  try {
    const newGoal = await Goal.create({
      userId,
      habitId,
      goal,
      startDate: new Date(),
      numberOfDaysToTrack: progressTrack,
    });
    return res.status(201).json(newGoal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return res.status(500).json({ message: 'Failed to create goal.' });
  }
});

// Get all goals
router.get('/getGoal', async (req, res) => {
  try {
    const goals = await Goal.find();
    return res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goal:', error);
    return res.status(500).json({ message: 'Failed to fetch goal.' });
  }
});

export default router;
