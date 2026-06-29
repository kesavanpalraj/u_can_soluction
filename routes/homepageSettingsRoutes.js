import express from "express";
import HomepageSettings from "../models/HomepageSettings.js";

const router = express.Router();

const defaultStats = [
    { value: 500, suffix: "+", label: "Students Trained" },
    { value: 50, suffix: "+", label: "Projects Completed" },
    { value: 95, suffix: "%", label: "Placement Rate" },
    { value: 20, suffix: "+", label: "Industry Partners" },
];

router.get("/", async (req, res) => {
    try {
        let settings = await HomepageSettings.findOne();
        if (!settings) {
            settings = await HomepageSettings.create({ stats: defaultStats });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/", async (req, res) => {
    try {
        const settings = await HomepageSettings.findOneAndUpdate(
            {},
            { ...req.body, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
