import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
    interestName: { type: String, required: true, unique: true },
}, { timestamps: false });

interestSchema.virtual('interestId').get(function () { return this._id; });
interestSchema.set('toJSON', { virtuals: true });

export const Interest = mongoose.model('Interest', interestSchema);

