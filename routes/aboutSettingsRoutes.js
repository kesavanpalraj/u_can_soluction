import express from "express";
import AboutSettings from "../models/AboutSettings.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let settings = await AboutSettings.findOne();
        if (!settings) {
            settings = await AboutSettings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/", async (req, res) => {
    try {
        const settings = await AboutSettings.findOneAndUpdate(
            {},
            { ...req.body, updatedAt: new Date() },
            { upsert: true, new: true, runValidators: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
