import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, required: true, unique: true },
}, { timestamps: false });

categorySchema.virtual('categoryId').get(function () { return this._id; });
categorySchema.set('toJSON', { virtuals: true });

export const Category = mongoose.model('Category', categorySchema);

