import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";
import CourseEnquiry from "../models/CourseEnquiry.js";

dotenv.config();
async function run() {
    await mongoose.connect(process.env.MONGODB_URI);

    const allCourses = await Course.find({}).lean();
    console.log("Total courses:", allCourses.length);
    for (const c of allCourses) {
        console.log(`${c._id} | courseId=${c.courseId} | title=${c.title}`);
    }

    console.log("\n--- Checking course refs ---");
    const enquiries = await CourseEnquiry.find({ type: "course" }).populate("course", "title courseId").lean();
    for (const e of enquiries) {
        console.log(`Enquiry: ${e.name} | course:`, JSON.stringify(e.course));
    }

    process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
