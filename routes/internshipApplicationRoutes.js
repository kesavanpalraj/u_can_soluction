import express from "express";
import InternshipApplication from "../models/InternshipApplication.js";
import { sendAdminNotification } from "../utils/emailNotification.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        
        const query = { deletedAt: null, picked: true };
        
        if (status) {
            query.status = status;
        }
        
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [enquiries, total] = await Promise.all([
            InternshipApplication.find(query)
                .sort({ pickedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            InternshipApplication.countDocuments(query)
        ]);
        
        res.json({
            enquiries,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/all", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        
        const query = { deletedAt: null };
        
        if (status) {
            query.status = status;
        }
        
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [enquiries, total] = await Promise.all([
            InternshipApplication.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            InternshipApplication.countDocuments(query)
        ]);
        
        res.json({
            enquiries,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const enquiry = await InternshipApplication.findById(req.params.id);
        if (!enquiry || enquiry.deletedAt) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const enquiry = new InternshipApplication({
            ...req.body,
            type: "internship"
        });
        await enquiry.save();

        sendAdminNotification({
            type: "internship",
            data: enquiry.toObject(),
        });

        res.status(201).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const enquiry = await InternshipApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        res.json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const enquiry = await InternshipApplication.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        enquiry.deletedAt = new Date();
        await enquiry.save();
        res.json({ message: "Application moved to trash" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/restore", async (req, res) => {
    try {
        const enquiry = await InternshipApplication.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: "Application not found" });
        }
        enquiry.deletedAt = null;
        await enquiry.save();
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
