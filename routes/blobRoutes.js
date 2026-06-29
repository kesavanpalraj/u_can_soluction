import express from "express";
import { put, del } from "@vercel/blob";
import fileUpload from "express-fileupload";

const router = express.Router();

router.use(fileUpload());

router.post("/", async (req, res) => {
    try {
        const file = req.files?.image;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const blob = await put(`testimonials/${Date.now()}-${file.name}`, file.data, {
            access: "public",
        });
        res.json({ url: blob.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/", async (req, res) => {
    try {
        const { url } = req.body;
        if (url) {
            await del(url);
        }
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
