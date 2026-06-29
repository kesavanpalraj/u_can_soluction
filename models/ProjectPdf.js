import mongoose from "mongoose";

const ProjectPdfSchema = new mongoose.Schema({
    url: {
        type: String,
        default: "",
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const ProjectPdf = mongoose.models.ProjectPdf || mongoose.model("ProjectPdf", ProjectPdfSchema);
export default ProjectPdf;
