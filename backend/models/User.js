import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    signUpDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    hasSelectedInterests: { type: Boolean, default: false },
}, { timestamps: false });

userSchema.virtual('userId').get(function () { return this._id; });
userSchema.set('toJSON', { virtuals: true });

export const User = mongoose.model('User', userSchema);

