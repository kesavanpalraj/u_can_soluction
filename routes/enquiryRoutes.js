import express from "express";
import ProjectEnquiry from "../models/ProjectEnquiry.js";
import CourseEnquiry from "../models/CourseEnquiry.js";
import InternshipApplication from "../models/InternshipApplication.js";
import Project from "../models/Project.js";
import Course from "../models/Course.js";
const router = express.Router();

router.get("/unified", async (req, res) => {
    try {
        const { page = 1, limit = 20, status, type, search, picked } = req.query;
        
        const baseQuery = { deletedAt: null };

        if (status) {
            baseQuery.status = { $eq: status, $ne: "archived" };
        } else {
            baseQuery.status = { $ne: "archived" };
        }
        
        if (type) {
            baseQuery.type = type;
        }
        
        if (picked !== undefined) {
            baseQuery.picked = picked === "true";
        }
        
        if (search) {
            const searchRegex = new RegExp(search, "i");
            baseQuery.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex }
            ];
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const [projectEnquiries, courseEnquiries, internshipApplications] = await Promise.all([
            ProjectEnquiry.find({ ...baseQuery, type: "project" })
                .populate("project", "title projectId")
                .sort({ createdAt: -1 }),
            CourseEnquiry.find({ ...baseQuery, type: "course" })
                .populate("course", "title courseId")
                .sort({ createdAt: -1 }),
            InternshipApplication.find({ ...baseQuery, type: "internship" })
                .sort({ createdAt: -1 })
        ]);
        
        let allEnquiries = [
            ...projectEnquiries.map(e => {
                const obj = e.toObject();
                const project = obj.project || (obj.projectId ? { title: obj.projectId } : null);
                return { ...obj, item: project };
            }),
            ...courseEnquiries.map(e => {
                const obj = e.toObject();
                const course = obj.course || (obj.courseId ? { title: obj.courseId } : null);
                return { ...obj, item: course };
            }),
            ...internshipApplications.map(e => ({ ...e.toObject(), item: { title: e.domain || 'Internship' } }))
        ];

        allEnquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const total = allEnquiries.length;
        const paginatedEnquiries = allEnquiries.slice(skip, skip + parseInt(limit));
        
        res.json({
            enquiries: paginatedEnquiries,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/stats", async (req, res) => {
    try {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const [
            projectTotal, courseTotal, internshipTotal,
            projectNew, courseNew, internshipNew,
            projectWeek, courseWeek, internshipWeek
        ] = await Promise.all([
            ProjectEnquiry.countDocuments({ deletedAt: null, picked: false }),
            CourseEnquiry.countDocuments({ deletedAt: null, picked: false }),
            InternshipApplication.countDocuments({ deletedAt: null, picked: false }),
            ProjectEnquiry.countDocuments({ deletedAt: null, picked: false, status: "new" }),
            CourseEnquiry.countDocuments({ deletedAt: null, picked: false, status: "new" }),
            InternshipApplication.countDocuments({ deletedAt: null, picked: false, status: "new" }),
            ProjectEnquiry.countDocuments({ deletedAt: null, picked: false, createdAt: { $gte: weekAgo } }),
            CourseEnquiry.countDocuments({ deletedAt: null, picked: false, createdAt: { $gte: weekAgo } }),
            InternshipApplication.countDocuments({ deletedAt: null, picked: false, createdAt: { $gte: weekAgo } })
        ]);
        
        res.json({
            total: projectTotal + courseTotal + internshipTotal,
            new: projectNew + courseNew + internshipNew,
            thisWeek: projectWeek + courseWeek + internshipWeek
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/pick/:id", async (req, res) => {
    try {
        const { type } = req.body;
        const { id } = req.params;
        
        let Model;
        switch (type) {
            case "project":
                Model = ProjectEnquiry;
                break;
            case "course":
                Model = CourseEnquiry;
                break;
            case "internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        
        const enquiry = await Model.findByIdAndUpdate(
            id,
            { picked: true, pickedAt: new Date(), status: "todo" },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/status/:id", async (req, res) => {
    try {
        const { type, status } = req.body;
        const { id } = req.params;
        
        let Model;
        switch (type) {
            case "project":
                Model = ProjectEnquiry;
                break;
            case "course":
                Model = CourseEnquiry;
                break;
            case "internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        
        const enquiry = await Model.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/unpick/:id", async (req, res) => {
    try {
        const { type } = req.body;
        const { id } = req.params;
        
        let Model;
        switch (type) {
            case "project":
                Model = ProjectEnquiry;
                break;
            case "course":
                Model = CourseEnquiry;
                break;
            case "internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        
        const enquiry = await Model.findByIdAndUpdate(
            id,
            { picked: false, pickedAt: null },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/trash/:id", async (req, res) => {
    try {
        const { type } = req.body;
        const { id } = req.params;
        
        let Model;
        switch (type) {
            case "project":
                Model = ProjectEnquiry;
                break;
            case "course":
                Model = CourseEnquiry;
                break;
            case "internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        
        const enquiry = await Model.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        res.json({ message: "Enquiry moved to trash" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/archive/:id", async (req, res) => {
    try {
        const { type } = req.body;
        const { id } = req.params;
        
        let Model;
        switch (type) {
            case "project":
                Model = ProjectEnquiry;
                break;
            case "course":
                Model = CourseEnquiry;
                break;
            case "internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        
        const enquiry = await Model.findByIdAndUpdate(
            id,
            { status: "archived", picked: true },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        res.json({ message: "Enquiry archived" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/restore/:id", async (req, res) => {
    try {
        const { type } = req.body;
        const { id } = req.params;
        
        let Model;
        switch (type) {
            case "project":
                Model = ProjectEnquiry;
                break;
            case "course":
                Model = CourseEnquiry;
                break;
            case "internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }
        
        const enquiry = await Model.findByIdAndUpdate(
            id,
            { deletedAt: null },
            { new: true }
        );
        
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }
        
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/cleanup", async (req, res) => {
    try {
        const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const filter = { deletedAt: { $lte: cutoff, $ne: null } };

        const [pDel, peDel, cDel, ceDel, iDel] = await Promise.all([
            Project.deleteMany(filter),
            ProjectEnquiry.deleteMany(filter),
            Course.deleteMany(filter),
            CourseEnquiry.deleteMany(filter),
            InternshipApplication.deleteMany(filter),
        ]);

        const total = pDel.deletedCount + peDel.deletedCount + cDel.deletedCount + ceDel.deletedCount + iDel.deletedCount;
        res.json({ message: `Cleaned up ${total} expired items`, deleted: total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/permanent/:id", async (req, res) => {
    try {
        const { type } = req.body;
        const { id } = req.params;

        let Model;
        switch (type) {
            case "project":
                Model = Project;
                break;
            case "course":
                Model = Course;
                break;
            case "enquiry-project":
                Model = ProjectEnquiry;
                break;
            case "enquiry-course":
                Model = CourseEnquiry;
                break;
            case "enquiry-internship":
                Model = InternshipApplication;
                break;
            default:
                return res.status(400).json({ message: "Invalid type" });
        }

        await Model.findByIdAndDelete(id);
        res.json({ message: "Item permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/trashed", async (req, res) => {
    try {
        const { page = 1, limit = 20, type, search } = req.query;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const fetchPromises = [];
        
        if (!type || type === 'project' || type === 'enquiry-project') {
            fetchPromises.push(
                Project.find({ deletedAt: { $ne: null } })
                    .populate("category", "name")
                    .sort({ deletedAt: -1 })
                    .then(items => items.map(item => ({
                        ...item.toObject(),
                        _id: item._id,
                        type: 'project',
                        source: 'Inventory',
                        name: item.title
                    })))
            );
            fetchPromises.push(
                ProjectEnquiry.find({ deletedAt: { $ne: null } })
                    .populate("project", "title projectId")
                    .sort({ deletedAt: -1 })
                    .then(items => items.map(item => ({
                        ...item.toObject(),
                        _id: item._id,
                        type: 'enquiry',
                        source: 'Project Enquiry',
                        name: item.name
                    })))
            );
        }
        
        if (!type || type === 'course' || type === 'enquiry-course') {
            fetchPromises.push(
                Course.find({ deletedAt: { $ne: null } })
                    .populate("category", "name")
                    .sort({ deletedAt: -1 })
                    .then(items => items.map(item => ({
                        ...item.toObject(),
                        _id: item._id,
                        type: 'course',
                        source: 'Inventory',
                        name: item.title
                    })))
            );
            fetchPromises.push(
                CourseEnquiry.find({ deletedAt: { $ne: null } })
                    .sort({ deletedAt: -1 })
                    .then(items => items.map(item => ({
                        ...item.toObject(),
                        _id: item._id,
                        type: 'enquiry',
                        source: 'Course Enquiry',
                        name: item.name
                    })))
            );
        }
        
        if (!type || type === 'internship' || type === 'enquiry-internship') {
            fetchPromises.push(
                InternshipApplication.find({ deletedAt: { $ne: null } })
                    .sort({ deletedAt: -1 })
                    .then(items => items.map(item => ({
                        ...item.toObject(),
                        _id: item._id,
                        type: 'enquiry',
                        source: 'Internship Application',
                        name: item.name
                    })))
            );
        }
        
        const results = await Promise.all(fetchPromises);
        let allTrashed = results.flat();
        
        if (search) {
            const searchLower = search.toLowerCase();
            allTrashed = allTrashed.filter(item =>
                (item.name && item.name.toLowerCase().includes(searchLower)) ||
                (item.source && item.source.toLowerCase().includes(searchLower)) ||
                (item.type && item.type.toLowerCase().includes(searchLower))
            );
        }
        
        allTrashed.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
        
        const total = allTrashed.length;
        const paginated = allTrashed.slice(skip, skip + parseInt(limit));
        
        res.json({
            items: paginated,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/archived", async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const baseQuery = { deletedAt: null, status: "archived" };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [projectEnquiries, courseEnquiries, internshipApplications] = await Promise.all([
            ProjectEnquiry.find({ ...baseQuery, type: "project" })
                .populate("project", "title projectId")
                .sort({ updatedAt: -1 }),
            CourseEnquiry.find({ ...baseQuery, type: "course" })
                .populate("course", "title courseId")
                .sort({ updatedAt: -1 }),
            InternshipApplication.find({ ...baseQuery, type: "internship" })
                .sort({ updatedAt: -1 })
        ]);

        let allEnquiries = [
            ...projectEnquiries.map(e => {
                const obj = e.toObject();
                const project = obj.project || (obj.projectId ? { title: obj.projectId } : null);
                return { ...obj, item: project };
            }),
            ...courseEnquiries.map(e => {
                const obj = e.toObject();
                const course = obj.course || (obj.courseId ? { title: obj.courseId } : null);
                return { ...obj, item: course };
            }),
            ...internshipApplications.map(e => {
                const obj = e.toObject();
                return { ...obj, item: { title: obj.domain || 'Internship' } };
            })
        ];

        allEnquiries.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const total = allEnquiries.length;
        const paginatedEnquiries = allEnquiries.slice(skip, skip + parseInt(limit));

        res.json({
            enquiries: paginatedEnquiries,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
