import mongoose from "mongoose";

const CourseEnquirySchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    courseId: {
        type: String
    },
    type: {
        type: String,
        default: "course"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    degree: {
        type: String,
        default: ""
    },
    college: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["new", "reviewed", "todo", "in_progress", "complete", "archived"],
        default: "new"
    },
    picked: {
        type: Boolean,
        default: false
    },
    pickedAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

CourseEnquirySchema.index({ deletedAt: 1 });
CourseEnquirySchema.index({ status: 1 });
CourseEnquirySchema.index({ picked: 1 });

export default mongoose.model("CourseEnquiry", CourseEnquirySchema);
