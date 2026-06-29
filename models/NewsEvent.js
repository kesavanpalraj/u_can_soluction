import mongoose from "mongoose";

const NewsEventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["news", "event"],
        default: "news",
    },
    link: {
        type: String,
        default: "",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

NewsEventSchema.index({ deletedAt: 1 });
NewsEventSchema.index({ isActive: 1, order: 1 });

export default mongoose.model("NewsEvent", NewsEventSchema);
