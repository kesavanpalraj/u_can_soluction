import mongoose from "mongoose";

const InternshipDomainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("InternshipDomain", InternshipDomainSchema);
