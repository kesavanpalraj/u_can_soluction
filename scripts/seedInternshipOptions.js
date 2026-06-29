import mongoose from "mongoose";
import InternshipDomain from "../models/InternshipDomain.js";
import InternshipDuration from "../models/InternshipDuration.js";

const domains = [
    { name: "Internet of Things with Android", order: 0 },
    { name: "Python Programming and Robotics", order: 1 },
    { name: "Web Development (Full Stack)", order: 2 },
    { name: "Android App Development", order: 3 },
    { name: "Artificial Intelligence and Data Science", order: 4 }
];

const durations = [
    { name: "15 Days", order: 0 },
    { name: "30 Days", order: 1 }
];

async function seed() {
    await mongoose.connect("mongodb://localhost:27017/ucs");
    console.log("Connected to MongoDB");

    await InternshipDomain.deleteMany({});
    await InternshipDuration.deleteMany({});
    console.log("Cleared existing options");

    await InternshipDomain.insertMany(domains);
    await InternshipDuration.insertMany(durations);
    console.log(`Seeded ${domains.length} domains and ${durations.length} durations`);

    await mongoose.disconnect();
    console.log("Done");
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
