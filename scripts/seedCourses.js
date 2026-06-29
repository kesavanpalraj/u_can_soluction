import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js";

dotenv.config();

const courses = [
    {
        courseId: "C01",
        title: "Tally Prime",
        description: "Master accounting, GST, and payroll with hands-on Tally training.",
        mode: "Online",
        price: 4999,
        tags: ["Excel", "Sheets"],
        technologies: [
            { icon: "logos:microsoft-excel", label: "Excel" },
            { icon: "logos:google-sheets", label: "Sheets" }
        ],
        coverage: [
            "Accounting & Inventory Management",
            "GST Return Filing & Compliance",
            "Payroll Processing & Employee Management",
            "Financial Report Generation",
            "Tax Deduction at Source (TDS)"
        ],
        status: "published"
    },
    {
        courseId: "C02",
        title: "Desktop Publishing (DTP)",
        description: "Learn page layout, typography, and print-ready design.",
        mode: "Online-Offline",
        price: 3499,
        tags: ["InDesign", "Photoshop"],
        technologies: [
            { icon: "logos:adobe-indesign", label: "InDesign" },
            { icon: "logos:adobe-photoshop", label: "Photoshop" }
        ],
        coverage: [
            "Page Layout & Typography",
            "Adobe InDesign Mastery",
            "CorelDraw Graphics Suite",
            "Image Editing with Photoshop",
            "Print & Digital Publishing"
        ],
        status: "published"
    },
    {
        courseId: "C03",
        title: "Full Stack Development",
        description: "Build complete web applications from frontend to backend.",
        mode: "Online",
        price: 9999,
        tags: ["React", "Node.js", "MongoDB"],
        technologies: [
            { icon: "logos:react", label: "React" },
            { icon: "logos:nodejs-icon", label: "Node.js" },
            { icon: "logos:mongodb-icon", label: "MongoDB" }
        ],
        coverage: [
            "Frontend Development with React",
            "Backend APIs with Node.js & Express",
            "Database Design with MongoDB",
            "Authentication & Authorization",
            "Deployment & DevOps Basics"
        ],
        status: "published"
    },
    {
        courseId: "C04",
        title: "Mobile App Development",
        description: "Create cross-platform mobile apps with Flutter and Firebase.",
        mode: "Online",
        price: 8499,
        tags: ["Flutter", "Firebase"],
        technologies: [
            { icon: "logos:flutter", label: "Flutter" },
            { icon: "logos:firebase", label: "Firebase" }
        ],
        coverage: [
            "Cross-Platform Apps with Flutter",
            "State Management & Routing",
            "Firebase Integration",
            "REST API Integration",
            "App Store Deployment"
        ],
        status: "published"
    },
    {
        courseId: "C05",
        title: "Robotics & IoT",
        description: "Program microcontrollers and build real-world robotics projects.",
        mode: "Offline",
        price: 7999,
        tags: ["Arduino", "Pi"],
        technologies: [
            { icon: "logos:arduino", label: "Arduino" },
            { icon: "logos:raspberry-pi", label: "Pi" }
        ],
        coverage: [
            "Microcontroller Programming with Arduino",
            "Raspberry Pi & Linux Basics",
            "Sensor Integration & Data Acquisition",
            "Motor Control & Actuators",
            "IoT Communication Protocols"
        ],
        status: "published"
    },
    {
        courseId: "C06",
        title: "Animation",
        description: "Bring ideas to life with 2D/3D animation and motion graphics.",
        mode: "Online-Offline",
        price: 6499,
        tags: ["Blender", "After Effects"],
        technologies: [
            { icon: "logos:blender", label: "Blender" },
            { icon: "logos:adobe-after-effects", label: "After Effects" }
        ],
        coverage: [
            "2D Animation Principles",
            "3D Modeling with Blender",
            "Motion Graphics with After Effects",
            "Storyboarding & Character Design",
            "Rendering & Post-Production"
        ],
        status: "published"
    },
    {
        courseId: "C07",
        title: "Multimedia",
        description: "Master video editing, audio production, and digital content creation.",
        mode: "Online",
        price: 4999,
        tags: ["Premiere Pro", "Photoshop"],
        technologies: [
            { icon: "logos:adobe-premiere-pro", label: "Premiere Pro" },
            { icon: "logos:adobe-photoshop", label: "Photoshop" }
        ],
        coverage: [
            "Video Editing with Premiere Pro",
            "Audio Production & Sound Design",
            "Graphic Design Principles",
            "Motion Graphics & Visual Effects",
            "Digital Content Creation"
        ],
        status: "published"
    },
    {
        courseId: "C08",
        title: "Android Development",
        description: "Develop modern Android apps with Kotlin and Jetpack.",
        mode: "Online",
        price: 7499,
        tags: ["Android", "Kotlin"],
        technologies: [
            { icon: "logos:android-icon", label: "Android" },
            { icon: "logos:kotlin-icon", label: "Kotlin" }
        ],
        coverage: [
            "Kotlin Programming Fundamentals",
            "Android Studio & UI Design",
            "Jetpack Compose & Navigation",
            "Firebase Integration",
            "Play Store Publishing"
        ],
        status: "published"
    },
    {
        courseId: "C09",
        title: "Internet of Things (IoT)",
        description: "Connect devices and build smart IoT solutions from scratch.",
        mode: "Online",
        price: 6999,
        tags: ["Arduino", "Pi", "Python"],
        technologies: [
            { icon: "logos:arduino", label: "Arduino" },
            { icon: "logos:raspberry-pi", label: "Pi" },
            { icon: "logos:python", label: "Python" }
        ],
        coverage: [
            "ESP32 & Microcontroller Programming",
            "MQTT Protocol & Cloud Integration",
            "Sensor Networks & Data Logging",
            "Python for IoT Applications",
            "Smart Home Automation Projects"
        ],
        status: "published"
    },
    {
        courseId: "C10",
        title: "Web Designing",
        description: "Design stunning websites with Figma, HTML, CSS, and JavaScript.",
        mode: "Online",
        price: 4499,
        tags: ["Figma", "HTML5", "CSS3"],
        technologies: [
            { icon: "logos:figma", label: "Figma" },
            { icon: "logos:html-5", label: "HTML5" },
            { icon: "logos:css-3", label: "CSS3" }
        ],
        coverage: [
            "UI/UX Design with Figma",
            "HTML5 & CSS3 Mastery",
            "JavaScript & jQuery Essentials",
            "Responsive Design & Bootstrap",
            "Web Accessibility Standards"
        ],
        status: "published"
    },
    {
        courseId: "C11",
        title: ".NET Framework",
        description: "Build enterprise-grade applications with C# and ASP.NET Core.",
        mode: "Online",
        price: 8999,
        tags: [".NET", "C#"],
        technologies: [
            { icon: "logos:dotnet", label: ".NET" },
            { icon: "logos:csharp", label: "C#" }
        ],
        coverage: [
            "C# Programming Fundamentals",
            "ASP.NET Core MVC Architecture",
            "Entity Framework & Database Integration",
            "RESTful Web APIs Development",
            "SQL Server Management"
        ],
        status: "published"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        await Course.deleteMany({});
        console.log("Cleared existing courses");

        let count = 0;
        for (const course of courses) {
            await Course.create(course);
            console.log(`Created ${course.courseId} - ${course.title}`);
            count++;
        }

        console.log(`\nDone! ${count} courses created.`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seed();
