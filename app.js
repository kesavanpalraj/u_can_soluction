import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import projectEnquiryRoutes from "./routes/projectEnquiryRoutes.js";
import courseEnquiryRoutes from "./routes/courseEnquiryRoutes.js";
import internshipApplicationRoutes from "./routes/internshipApplicationRoutes.js";
import internshipDomainRoutes from "./routes/internshipDomainRoutes.js";
import internshipDurationRoutes from "./routes/internshipDurationRoutes.js";
import projectPdfRoutes from "./routes/projectPdfRoutes.js";
import newsEventRoutes from "./routes/newsEventRoutes.js";
import homepageSettingsRoutes from "./routes/homepageSettingsRoutes.js";
import blobRoutes from "./routes/blobRoutes.js";
import aboutSettingsRoutes from "./routes/aboutSettingsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is alive 🚀" });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/projects/enquiries", projectEnquiryRoutes);
app.use("/api/courses/enquiries", courseEnquiryRoutes);
app.use("/api/internships/applications", internshipApplicationRoutes);
app.use("/api/internships/domains", internshipDomainRoutes);
app.use("/api/internships/durations", internshipDurationRoutes);
app.use("/api/project-pdf", projectPdfRoutes);
app.use("/api/news-events", newsEventRoutes);
app.use("/api/homepage-settings", homepageSettingsRoutes);
app.use("/api/upload", blobRoutes);
app.use("/api/about-settings", aboutSettingsRoutes);
app.use("/api/auth", authRoutes);

export default app;
