import express from "express";
import ProjectEnquiry from "../models/ProjectEnquiry.js";
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
            ProjectEnquiry.find(query)
                .populate("project", "title projectId")
                .sort({ pickedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ProjectEnquiry.countDocuments(query)
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
            ProjectEnquiry.find(query)
                .populate("project", "title projectId")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            ProjectEnquiry.countDocuments(query)
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
        const enquiry = await ProjectEnquiry.findById(req.params.id)
            .populate("project", "title projectId");
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
        const enquiry = new ProjectEnquiry({
            ...req.body,
            type: "project"
        });
        await enquiry.save();
        
        const populated = await ProjectEnquiry.findById(enquiry._id)
            .populate("project", "title projectId");
        
        sendAdminNotification({
            type: "project",
            data: {
                ...populated.toObject(),
                projectTitle: populated.project?.title || "",
            },
        });

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const enquiry = await ProjectEnquiry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("project", "title projectId");
        
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
        const enquiry = await ProjectEnquiry.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        enquiry.deletedAt = new Date();
        await enquiry.save();
        res.json({ message: "Enquiry moved to trash" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/restore", async (req, res) => {
    try {
        const enquiry = await ProjectEnquiry.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        enquiry.deletedAt = null;
        await enquiry.save();
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
