import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true,
        maxlength: 5,
        validate: {
            validator: function(v) { return /^[a-zA-Z0-9]+$/.test(v); },
            message: "Project ID must be alphanumeric with no special characters"
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    tags: [String],
    downloadAbstract: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
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

ProjectSchema.index({ deletedAt: 1 });
ProjectSchema.index({ status: 1 });

export default mongoose.model("Project", ProjectSchema);
