import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habitName: { type: String, required: true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    startDate: { type: Date, default: Date.now },
    nextDueDate: { type: Date, required: true },
}, { timestamps: false });

habitSchema.virtual('habitId').get(function () { return this._id; });
habitSchema.set('toJSON', { virtuals: true });

export const Habit = mongoose.model('Habit', habitSchema);

