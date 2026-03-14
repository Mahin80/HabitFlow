import mongoose from 'mongoose';

const contactFeedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    thoughts: { type: String },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: false });

contactFeedbackSchema.virtual('feedbackId').get(function () { return this._id; });
contactFeedbackSchema.set('toJSON', { virtuals: true });

export const ContactFeedback = mongoose.model('ContactFeedback', contactFeedbackSchema);

