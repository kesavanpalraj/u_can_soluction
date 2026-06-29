import mongoose from "mongoose";

const InternshipDurationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("InternshipDuration", InternshipDurationSchema);
