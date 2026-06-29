import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["Online", "Offline", "Online-Offline"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    tags: [String],
    technologies: [{
        icon: { type: String },
        label: { type: String }
    }],
    coverage: [String],
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft"
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

CourseSchema.index({ deletedAt: 1 });
CourseSchema.index({ status: 1 });

export default mongoose.model("Course", CourseSchema);
