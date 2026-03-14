import mongoose from 'mongoose';

const userInterestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest', required: true },
}, { timestamps: false });

userInterestSchema.virtual('Id').get(function () { return this._id; });
userInterestSchema.set('toJSON', { virtuals: true });

export const UserInterest = mongoose.model('UserInterest', userInterestSchema);

