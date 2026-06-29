import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Project from "../models/Project.js";

dotenv.config();

const categoryDefs = [
    { name: "All", slug: "all", type: "project", order: 0 },
    { name: "Web Development", slug: "web-development", type: "project", order: 1 },
    { name: "Mobile Apps", slug: "mobile-apps", type: "project", order: 2 },
    { name: "AI & ML", slug: "ai-ml", type: "project", order: 3 },
    { name: "Internet of Things", slug: "internet-of-things", type: "project", order: 4 },
    { name: "Data Science", slug: "data-science", type: "project", order: 5 },
    { name: "Cybersecurity", slug: "cybersecurity", type: "project", order: 6 },
    { name: "Cloud Computing", slug: "cloud-computing", type: "project", order: 7 },
];

const projects = [
    {
        projectId: "P001",
        title: "E-Commerce Platform with Payment Integration",
        description: "Build a full-featured online store with product management, cart, and secure payment processing.",
        categorySlug: "web-development",
        tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
        status: "published",
    },
    {
        projectId: "P002",
        title: "Task Management Dashboard",
        description: "A collaborative project management tool with drag-and-drop boards, real-time updates, and team roles.",
        categorySlug: "web-development",
        tags: ["React", "Socket.io", "MongoDB", "DnD"],
        status: "published",
    },
    {
        projectId: "P003",
        title: "Real-Time Chat Application",
        description: "A messaging platform supporting private chats, group conversations, file sharing, and message history.",
        categorySlug: "web-development",
        tags: ["WebSocket", "React", "Firebase", "Express"],
        status: "published",
    },
    {
        projectId: "P004",
        title: "Portfolio Website Builder",
        description: "A drag-and-drop tool that lets users create personal portfolio websites from customizable templates.",
        categorySlug: "web-development",
        tags: ["Next.js", "Tailwind", "Cloudinary", "MongoDB"],
        status: "published",
    },
    {
        projectId: "P005",
        title: "Fitness Tracking Mobile App",
        description: "Track workouts, steps, calories, and sleep with visual dashboards and goal-setting features.",
        categorySlug: "mobile-apps",
        tags: ["Flutter", "Firebase", "Health API", "Charts"],
        status: "published",
    },
    {
        projectId: "P006",
        title: "Food Delivery Application",
        description: "A multi-vendor food delivery platform with real-time order tracking, ratings, and payment gateway.",
        categorySlug: "mobile-apps",
        tags: ["React Native", "Node.js", "Google Maps", "Firebase"],
        status: "published",
    },
    {
        projectId: "P007",
        title: "Expense Manager with Receipt Scanner",
        description: "Scan receipts using OCR, categorize expenses, set budgets, and view monthly spending reports.",
        categorySlug: "mobile-apps",
        tags: ["Kotlin", "ML Kit", "Room DB", "MPAndroidChart"],
        status: "published",
    },
    {
        projectId: "P008",
        title: "Smart Document Classifier",
        description: "Automatically classify and tag uploaded documents using a trained machine learning model.",
        categorySlug: "ai-ml",
        tags: ["Python", "TensorFlow", "Flask", "NLP"],
        status: "published",
    },
    {
        projectId: "P009",
        title: "Customer Sentiment Analyzer",
        description: "Analyze product reviews and social media posts to determine positive, negative, or neutral sentiment.",
        categorySlug: "ai-ml",
        tags: ["Python", "NLTK", "Scikit-learn", "Django"],
        status: "published",
    },
    {
        projectId: "P010",
        title: "Image Recognition System",
        description: "Identify objects, faces, and text in images using deep learning with a web-based interface.",
        categorySlug: "ai-ml",
        tags: ["Python", "PyTorch", "OpenCV", "FastAPI"],
        status: "published",
    },
    {
        projectId: "P011",
        title: "AI-Powered Customer Support Chatbot",
        description: "A conversational chatbot that answers FAQs, triages support tickets, and escalates complex issues.",
        categorySlug: "ai-ml",
        tags: ["Python", "Rasa", "BERT", "React"],
        status: "published",
    },
    {
        projectId: "P012",
        title: "Smart Home Automation System",
        description: "Control lights, fans, and appliances via a mobile interface with voice commands and scheduling.",
        categorySlug: "internet-of-things",
        tags: ["ESP32", "MQTT", "React Native", "Arduino"],
        status: "published",
    },
    {
        projectId: "P013",
        title: "Weather Monitoring Station",
        description: "Collect real-time environmental data using sensors and display forecasts on a live dashboard.",
        categorySlug: "internet-of-things",
        tags: ["Raspberry Pi", "DHT11", "Node.js", "Chart.js"],
        status: "published",
    },
    {
        projectId: "P014",
        title: "Smart Agriculture Monitoring",
        description: "Monitor soil moisture, temperature, and humidity in farmland with automated irrigation triggers.",
        categorySlug: "internet-of-things",
        tags: ["Arduino", "Soil Sensor", "GSM", "ThingSpeak"],
        status: "published",
    },
    {
        projectId: "P015",
        title: "Sales Forecasting Dashboard",
        description: "Analyze historical sales data and predict future trends using time series models.",
        categorySlug: "data-science",
        tags: ["Python", "Prophet", "Pandas", "Tableau"],
        status: "published",
    },
    {
        projectId: "P016",
        title: "Social Media Analytics Tool",
        description: "Track engagement, follower growth, and post performance across multiple social platforms.",
        categorySlug: "data-science",
        tags: ["Python", "Graph API", "Power BI", "SQL"],
        status: "published",
    },
    {
        projectId: "P017",
        title: "Network Intrusion Detection System",
        description: "Monitor network traffic for suspicious activity and alert administrators of potential breaches.",
        categorySlug: "cybersecurity",
        tags: ["Python", "Scapy", "Wireshark", "Machine Learning"],
        status: "published",
    },
    {
        projectId: "P018",
        title: "Password Manager with Encryption",
        description: "Securely store and auto-fill passwords using AES-256 encryption with a master password.",
        categorySlug: "cybersecurity",
        tags: ["Electron", "CryptoJS", "SQLite", "React"],
        status: "published",
    },
    {
        projectId: "P019",
        title: "Cloud-Based File Storage System",
        description: "Upload, organize, and share files in the cloud with role-based access control and versioning.",
        categorySlug: "cloud-computing",
        tags: ["AWS S3", "Node.js", "React", "Docker"],
        status: "published",
    },
    {
        projectId: "P020",
        title: "Scalable Serverless API Gateway",
        description: "Design a serverless backend with auto-scaling, rate limiting, and API key management.",
        categorySlug: "cloud-computing",
        tags: ["AWS Lambda", "API Gateway", "DynamoDB", "Terraform"],
        status: "published",
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        const slugToId = {};
        for (const catDef of categoryDefs) {
            const cat = await Category.findOneAndUpdate(
                { slug: catDef.slug },
                { $setOnInsert: catDef },
                { upsert: true, new: true }
            );
            slugToId[catDef.slug] = cat._id;
        }
        console.log(`Ensured ${categoryDefs.length} categories`);

        let created = 0;
        let skipped = 0;
        for (const proj of projects) {
            const existing = await Project.findOne({ projectId: proj.projectId });
            if (existing) {
                skipped++;
                continue;
            }
            await Project.create({
                projectId: proj.projectId,
                title: proj.title,
                description: proj.description,
                category: slugToId[proj.categorySlug],
                tags: proj.tags,
                status: proj.status,
            });
            created++;
        }

        console.log(`Created ${created} projects, skipped ${skipped} existing`);
        await mongoose.disconnect();
        console.log("Done");
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
