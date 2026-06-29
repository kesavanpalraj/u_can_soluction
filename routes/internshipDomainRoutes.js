import express from "express";
import InternshipDomain from "../models/InternshipDomain.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const domains = await InternshipDomain.find().sort({ order: 1, createdAt: 1 });
        res.json(domains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const domain = await InternshipDomain.create(req.body);
        res.status(201).json(domain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const domain = await InternshipDomain.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!domain) return res.status(404).json({ message: "Domain not found" });
        res.json(domain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const domain = await InternshipDomain.findByIdAndDelete(req.params.id);
        if (!domain) return res.status(404).json({ message: "Domain not found" });
        res.json({ message: "Domain deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
