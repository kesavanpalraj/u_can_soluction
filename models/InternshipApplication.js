import mongoose from "mongoose";

const InternshipApplicationSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "internship"
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: String,
        enum: ["Completed", "1st Year", "2nd Year", "3rd Year", "4th Year"],
        required: true
    },
    college: {
        type: String,
        required: true
    },
    collegeLocation: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["Online", "Offline"],
        required: true
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

InternshipApplicationSchema.index({ deletedAt: 1 });
InternshipApplicationSchema.index({ status: 1 });
InternshipApplicationSchema.index({ picked: 1 });

export default mongoose.model("InternshipApplication", InternshipApplicationSchema);
