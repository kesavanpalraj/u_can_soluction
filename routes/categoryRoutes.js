import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { type, includeDeleted } = req.query;
        
        const query = { deletedAt: null };
        
        if (includeDeleted === "true") {
            delete query.deletedAt;
        }
        
        if (type) {
            query.$or = [{ type }, { type: { $exists: false } }];
        }
        
        const categories = await Category.find(query)
            .sort({ order: 1, name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category || category.deletedAt) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        category.deletedAt = new Date();
        await category.save();
        res.json({ message: "Category moved to trash" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:id/restore", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        category.deletedAt = null;
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/trashed/all", async (req, res) => {
    try {
        const categories = await Category.find({ deletedAt: { $ne: null } })
            .sort({ deletedAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
