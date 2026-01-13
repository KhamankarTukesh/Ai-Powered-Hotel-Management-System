import Complaint from '../models/Complaint.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createComplaint = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const studentId = req.user.id; // Protect middleware se aayega

        // --- AI Logic Start ---
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Analyze this hostel complaint and return only one word for priority (Low, Medium, High, or Urgent) based on its severity:
        Title: ${title}
        Description: ${description}`;

        const result = await model.generateContent(prompt);
        const aiPriority = result.response.text().trim(); 
        // --- AI Logic End ---

        const newComplaint = await Complaint.create({
            student: studentId,
            title,
            description,
            category,
            priority: aiPriority || 'Low' // AI ne jo bola wo set hoga
        });

        res.status(201).json({ 
            message: "Complaint registered with AI Priority!", 
            newComplaint 
        });

    } catch (error) {
        res.status(500).json({ message: "AI Analysis Failed, but complaint saved.", error: error.message });
    }
};