import mongoose from 'mongoose';

const habitProgressSchema = new mongoose.Schema({
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completionDate: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
}, { timestamps: false });

habitProgressSchema.virtual('progressId').get(function () { return this._id; });
habitProgressSchema.set('toJSON', { virtuals: true });

export const HabitProgress = mongoose.model('HabitProgress', habitProgressSchema);

