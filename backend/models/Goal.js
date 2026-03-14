import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
    goal: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    numberOfDaysToTrack: { type: Number, required: true },
}, { timestamps: false });

goalSchema.virtual('goalId').get(function () { return this._id; });
goalSchema.set('toJSON', { virtuals: true });

export const Goal = mongoose.model('Goal', goalSchema);

