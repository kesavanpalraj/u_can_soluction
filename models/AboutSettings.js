import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
}, { _id: true });

const GalleryImageSchema = new mongoose.Schema({
    alt: { type: String, default: "" },
    image: { type: String, default: "" },
}, { _id: true });

const AboutSettingsSchema = new mongoose.Schema({
    aboutTitle: { type: String, default: "About us" },
    aboutParagraphs: { type: [String], default: [
        "U Can Solution is a leading project development and training institute dedicated to empowering students and professionals with industry-oriented skills since 2010. With centers in Thiruthangal and Coimbatore, we focus on delivering practical learning experiences through professional training, internships, and real-time project development.",
        "Our goal is to bridge the gap between academic learning and industry expectations by providing hands-on exposure, updated technologies, and career-focused guidance. We believe learning should be practical, accessible, and aligned with the demands of today's fast-evolving digital world."
    ] },
    team: { type: [TeamMemberSchema], default: [
        { name: "Ganesh P", role: "Founder & CEO", image: "", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { name: "Karthi P", role: "Technology Trainer", image: "", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
        { name: "Saranya J", role: "Computer Trainer", image: "", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    ] },
    gallery: { type: [GalleryImageSchema], default: [
        { alt: "Students in classroom", image: "" },
        { alt: "Award ceremony", image: "" },
        { alt: "Hackathon event", image: "" },
        { alt: "Industry visit", image: "" },
        { alt: "Project presentation", image: "" },
        { alt: "Alumni meetup", image: "" },
    ] },
}, { timestamps: true });

const AboutSettings = mongoose.models.AboutSettings
    || mongoose.model("AboutSettings", AboutSettingsSchema);
export default AboutSettings;
