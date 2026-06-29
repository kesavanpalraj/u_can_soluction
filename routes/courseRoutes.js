import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { search, page = 1, limit = 30, status, includeDeleted } = req.query;
        
        const query = { deletedAt: null };
        
        if (includeDeleted === "true") {
            delete query.deletedAt;
        }
        
        if (status) {
            if (status === "trashed") {
                query.deletedAt = { $ne: null };
            } else {
                query.status = status;
            }
        }
        
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { title: searchRegex },
                { courseId: searchRegex },
                { tags: { $in: [searchRegex] } }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [courses, total] = await Promise.all([
            Course.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Course.countDocuments(query)
        ]);
        
        res.json({
            courses,
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
        const course = await Course.findById(req.params.id);
        if (!course || course.deletedAt) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        course.deletedAt = new Date();
        await course.save();
        res.json({ message: "Course moved to trash" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/restore", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        course.deletedAt = null;
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/bulk-update", async (req, res) => {
    try {
        const { ids, action, data } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "IDs array required" });
        }
        
        let result;
        switch (action) {
            case "publish":
                result = await Course.updateMany(
                    { _id: { $in: ids } },
                    { status: "published" }
                );
                break;
            case "draft":
                result = await Course.updateMany(
                    { _id: { $in: ids } },
                    { status: "draft" }
                );
                break;
            case "archive":
                result = await Course.updateMany(
                    { _id: { $in: ids } },
                    { status: "archived" }
                );
                break;
            case "trash":
                result = await Course.updateMany(
                    { _id: { $in: ids } },
                    { deletedAt: new Date() }
                );
                break;
            case "restore":
                result = await Course.updateMany(
                    { _id: { $in: ids } },
                    { deletedAt: null }
                );
                break;
            default:
                return res.status(400).json({ message: "Invalid action" });
        }
        
        res.json({ message: `Updated ${result.modifiedCount} courses` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id/permanent", async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
