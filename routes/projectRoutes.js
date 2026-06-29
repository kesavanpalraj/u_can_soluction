import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { category, search, page = 1, limit = 30, status, includeDeleted } = req.query;
        
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
        
        if (category && category !== "All") {
            query.category = category;
        }
        
        if (search) {
            const searchRegex = new RegExp(search, "i");
            query.$or = [
                { title: searchRegex },
                { projectId: searchRegex },
                { tags: { $in: [searchRegex] } }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [projects, total] = await Promise.all([
            Project.find(query)
                .populate("category", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Project.countDocuments(query)
        ]);
        
        res.json({
            projects,
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
        const project = await Project.findById(req.params.id)
            .populate("category", "name slug");
        if (!project || project.deletedAt) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        project.deletedAt = new Date();
        await project.save();
        res.json({ message: "Project moved to trash" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/restore", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        project.deletedAt = null;
        await project.save();
        res.json(project);
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
                result = await Project.updateMany(
                    { _id: { $in: ids } },
                    { status: "published" }
                );
                break;
            case "draft":
                result = await Project.updateMany(
                    { _id: { $in: ids } },
                    { status: "draft" }
                );
                break;
            case "archive":
                result = await Project.updateMany(
                    { _id: { $in: ids } },
                    { status: "archived" }
                );
                break;
            case "trash":
                result = await Project.updateMany(
                    { _id: { $in: ids } },
                    { deletedAt: new Date() }
                );
                break;
            case "restore":
                result = await Project.updateMany(
                    { _id: { $in: ids } },
                    { deletedAt: null }
                );
                break;
            default:
                return res.status(400).json({ message: "Invalid action" });
        }
        
        res.json({ message: `Updated ${result.modifiedCount} projects` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id/permanent", async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
