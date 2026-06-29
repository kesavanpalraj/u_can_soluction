import mongoose from "mongoose";

const StatSchema = new mongoose.Schema({
    value: { type: Number, default: 0 },
    suffix: { type: String, default: "" },
    label: { type: String, default: "" },
}, { _id: false });

const TestimonialSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    text: { type: String, default: "" },
}, { _id: true });

const GoogleRatingSchema = new mongoose.Schema({
    rating: { type: Number, default: 4.9 },
    count: { type: Number, default: 120 },
}, { _id: false });

const HomepageSettingsSchema = new mongoose.Schema({
    googleRating: { type: GoogleRatingSchema, default: () => ({}) },
    stats: { type: [StatSchema], default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
}, { timestamps: true });

const HomepageSettings = mongoose.models.HomepageSettings || mongoose.model("HomepageSettings", HomepageSettingsSchema);
export default HomepageSettings;
