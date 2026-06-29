import express from "express";
import NewsEvent from "../models/NewsEvent.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const items = await NewsEvent.find({ deletedAt: null, isActive: true })
            .sort({ order: 1, createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/all", async (req, res) => {
    try {
        const items = await NewsEvent.find({ deletedAt: null })
            .sort({ order: 1, createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const item = new NewsEvent(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const item = await NewsEvent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const item = await NewsEvent.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        item.deletedAt = new Date();
        await item.save();
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
