import mongoose from 'mongoose';

const defaultHabitSchema = new mongoose.Schema({
    habitName: { type: String, required: true },
    habitDescription: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: false });

defaultHabitSchema.set('toJSON', { virtuals: true });

export const DefaultHabit = mongoose.model('DefaultHabit', defaultHabitSchema);
