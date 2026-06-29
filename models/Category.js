import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["project", "course", "internship"],
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

CategorySchema.index({ deletedAt: 1 });
CategorySchema.index({ type: 1 });

export default mongoose.model("Category", CategorySchema);
