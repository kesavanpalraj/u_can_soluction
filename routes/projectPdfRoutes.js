import express from "express";
import ProjectPdf from "../models/ProjectPdf.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let doc = await ProjectPdf.findOne();
        if (!doc) {
            doc = await ProjectPdf.create({ url: "" });
        }
        res.json({ url: doc.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/", async (req, res) => {
    try {
        const { url } = req.body;
        const doc = await ProjectPdf.findOneAndUpdate(
            {},
            { url, updatedAt: new Date() },
            { upsert: true, new: true }
        );
        res.json({ url: doc.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
