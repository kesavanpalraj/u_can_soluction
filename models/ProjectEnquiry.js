import mongoose from "mongoose";

const ProjectEnquirySchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    projectId: {
        type: String
    },
    type: {
        type: String,
        default: "project"
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

ProjectEnquirySchema.index({ deletedAt: 1 });
ProjectEnquirySchema.index({ status: 1 });
ProjectEnquirySchema.index({ picked: 1 });

export default mongoose.model("ProjectEnquiry", ProjectEnquirySchema);
