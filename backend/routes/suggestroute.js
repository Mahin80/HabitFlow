import express from "express";
import { UserInterest } from "../models/UserInterest.js";
import { InterestHabit } from "../models/InterestHabit.js";
import { DefaultHabit } from "../models/DefaultHabit.js";
import { Category } from "../models/Category.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Step 1: Get user's interest IDs
        const userInterests = await UserInterest.find({ userId });
        const interestIds = userInterests.map((ui) => ui.interestId);

        // Step 2: Fetch habits based on user's interests
        const interestHabits = await InterestHabit.find({ interestId: { $in: interestIds } });

        // Step 3: Fetch default habits for fixed categories
        const fixedCategories = ["Health & Fitness", "Hobbies", "Productivity"];
        const categories = await Category.find({ categoryName: { $in: fixedCategories } });
        const categoryIdToName = {};
        categories.forEach((c) => { categoryIdToName[c._id.toString()] = c.categoryName; });
        const categoryIds = categories.map((c) => c._id);

        const defaultHabits = await DefaultHabit.find({ categoryId: { $in: categoryIds } });

        // Group habits by category
        const categoryHabitMap = {};
        fixedCategories.forEach((cat) => { categoryHabitMap[cat] = []; });

        defaultHabits.forEach((habit) => {
            const catName = categoryIdToName[habit.categoryId.toString()];
            if (catName && categoryHabitMap[catName]) {
                categoryHabitMap[catName].push(habit.toJSON());
            }
        });

        interestHabits.forEach((habit) => {
            if (!categoryHabitMap["Other"]) categoryHabitMap["Other"] = [];
            categoryHabitMap["Other"].push(habit.toJSON());
        });

        res.json({ categoryHabits: categoryHabitMap });
    } catch (error) {
        console.error("Error fetching habit suggestions:", error);
        res.status(500).json({ error: "Failed to fetch habit suggestions." });
    }
});

export default router;