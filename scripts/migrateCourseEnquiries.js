import mongoose from "mongoose";
import dotenv from "dotenv";
import CourseEnquiry from "../models/CourseEnquiry.js";
import Course from "../models/Course.js";

dotenv.config();

const OLD_ID_TO_TITLE = {
    "tally": "Tally Prime",
    "dtp": "Desktop Publishing (DTP)",
    "full-stack": "Full Stack Development",
    "mobile-dev": "Mobile App Development",
    "robotics": "Robotics & IoT",
    "animation": "Animation",
    "multimedia": "Multimedia",
    "android": "Android Development",
    "iot": "Internet of Things (IoT)",
    "web-design": "Web Designing",
    "net-framework": ".NET Framework",
};

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const enquiries = await CourseEnquiry.find({ course: null });
        console.log(`Found ${enquiries.length} course enquiries with null course\n`);

        let updated = 0;
        let skipped = 0;

        for (const enquiry of enquiries) {
            const raw = enquiry.toObject();
            const courseIdStr = raw.courseId;
            let courseDoc = null;

            if (courseIdStr) {
                courseDoc = await Course.findOne({ courseId: courseIdStr });
                if (!courseDoc) {
                    const title = OLD_ID_TO_TITLE[courseIdStr];
                    if (title) {
                        courseDoc = await Course.findOne({ title });
                    }
                }
            }

            if (courseDoc) {
                await CourseEnquiry.findByIdAndUpdate(enquiry._id, { course: courseDoc._id });
                console.log(`  Updated: ${raw.name} → ${courseDoc.title}`);
                updated++;
            } else {
                console.log(`  Skipped: ${raw.name} (courseId: "${courseIdStr || "(none)"}" — no match found)`);
                skipped++;
            }
        }

        console.log(`\nDone! ${updated} updated, ${skipped} skipped.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    }
}

migrate();
