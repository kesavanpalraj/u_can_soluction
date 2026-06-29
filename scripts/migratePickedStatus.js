import mongoose from "mongoose";
import dotenv from "dotenv";
import ProjectEnquiry from "../models/ProjectEnquiry.js";
import CourseEnquiry from "../models/CourseEnquiry.js";
import InternshipApplication from "../models/InternshipApplication.js";

dotenv.config();

const MODELS = [
    { model: ProjectEnquiry, name: "ProjectEnquiry" },
    { model: CourseEnquiry, name: "CourseEnquiry" },
    { model: InternshipApplication, name: "InternshipApplication" },
];

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB\n");

        let totalUpdated = 0;

        for (const { model, name } of MODELS) {
            const docs = await model.find({ picked: true, status: { $in: ["new", "reviewed"] } });
            if (docs.length === 0) {
                console.log(`${name}: 0 documents need updating`);
                continue;
            }
            const result = await model.updateMany(
                { picked: true, status: { $in: ["new", "reviewed"] } },
                { $set: { status: "todo" } }
            );
            console.log(`${name}: ${result.modifiedCount} updated`);
            totalUpdated += result.modifiedCount;
        }

        console.log(`\nDone! ${totalUpdated} total documents updated.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration error:", error);
        process.exit(1);
    }
}

migrate();
