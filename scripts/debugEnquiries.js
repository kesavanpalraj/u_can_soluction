import mongoose from "mongoose";
import dotenv from "dotenv";
import CourseEnquiry from "../models/CourseEnquiry.js";

dotenv.config();
async function run() {
    await mongoose.connect(process.env.MONGODB_URI);

    const total = await CourseEnquiry.countDocuments({ type: "course" });
    console.log("Total course enquiries:", total);

    const withCourse = await CourseEnquiry.countDocuments({ type: "course", course: { $ne: null } });
    console.log("With non-null course:", withCourse);

    const nullCourse = await CourseEnquiry.countDocuments({ type: "course", course: null });
    console.log("With null course:", nullCourse);

    const samples = await CourseEnquiry.find({ type: "course" }).limit(5).lean();
    for (const s of samples) {
        console.log("---");
        console.log("name:", s.name);
        console.log("course:", s.course);
        console.log("courseId:", s.courseId);
        console.log("_id:", s._id);
    }

    process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
