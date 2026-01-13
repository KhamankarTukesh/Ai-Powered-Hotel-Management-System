import Complaint from '../models/Complaint.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// AI Setup - Make sure process.env.GEMINI_API_KEY is correct in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createComplaint = async (req, res) => {
    const { title, description, category } = req.body;
    const studentId = req.user.id;

    try {
        // Fix: Use "gemini-1.5-flash" without any prefix
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Task: Analyze hostel complaint.
        Return ONLY one word from this list: Low, Medium, High, Urgent.
        Complaint: ${title} - ${description}`;

        const result = await model.generateContent(prompt);
        let aiPriority = result.response.text().trim();

        const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
        if (!validPriorities.includes(aiPriority)) {
            aiPriority = validPriorities.find(p => aiPriority.includes(p)) || 'Low';
        }

        const newComplaint = await Complaint.create({
            student: studentId,
            title,
            description,
            category,
            priority: aiPriority
        });

        res.status(201).json({
            message: "Complaint registered with AI Priority! 🤖",
            newComplaint
        });

    } catch (error) {
        console.error("AI Error Details:", error.message);

        // 🛡️ BACKUP LOGIC: Agar AI fail ho jaye (Key issue ya Model issue)
        let backupPriority = "Low";
        const fullText = (title + " " + description).toLowerCase();

        // Keywords for urgent situations
        if (fullText.includes("short circuit") || fullText.includes("fire") || fullText.includes("smoke") || fullText.includes("sparks")) {
            backupPriority = "Urgent";
        } else if (fullText.includes("not working") || fullText.includes("broken") || fullText.includes("water leak")) {
            backupPriority = "High";
        }

        const newComplaint = await Complaint.create({
            student: studentId,
            title,
            description,
            category,
            priority: backupPriority
        });

        res.status(201).json({
            message: "AI analysis failed, used Backup Logic to save complaint. ✅",
            newComplaint
        });
    }
};



// 1. Saari Complaints dekhna (Only for Warden/Admin)
export const getAllComplaints = async (req, res) => {
    try {
        // Sort: Urgent/High pehle dikhegi, phir baki
        const complaints = await Complaint.find()
            .populate('student', 'fullName')
            .sort({ createdAt: -1 }); // Nayi shikayaten upar

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints", error: error.message });
    }
};

// 2. Complaint Status badalna (Resolve karna)
export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Status: 'In Progress' ya 'Resolved'

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );

        if (!updatedComplaint) return res.status(404).json({ message: "Complaint not found" });

        res.status(200).json({ message: "Status updated!", updatedComplaint });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};