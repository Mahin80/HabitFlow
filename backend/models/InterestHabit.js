import mongoose from 'mongoose';

const interestHabitSchema = new mongoose.Schema({
    interestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest', required: true },
    habitName: { type: String, required: true },
    habitDescription: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: false });

interestHabitSchema.set('toJSON', { virtuals: true });

export const InterestHabit = mongoose.model('InterestHabit', interestHabitSchema);
