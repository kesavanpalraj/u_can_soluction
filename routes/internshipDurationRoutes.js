import express from "express";
import InternshipDuration from "../models/InternshipDuration.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const durations = await InternshipDuration.find().sort({ order: 1, createdAt: 1 });
        res.json(durations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const duration = await InternshipDuration.create(req.body);
        res.status(201).json(duration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const duration = await InternshipDuration.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!duration) return res.status(404).json({ message: "Duration not found" });
        res.json(duration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const duration = await InternshipDuration.findByIdAndDelete(req.params.id);
        if (!duration) return res.status(404).json({ message: "Duration not found" });
        res.json({ message: "Duration deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
