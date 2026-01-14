import dotenv from "dotenv";
dotenv.config();
import Complaint from '../models/Complaint.js';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const studentId = req.user.id;

    // 🔹 STRONG PROMPT (1 WORD ONLY)
    const prompt = `
Analyze this hostel complaint and return ONLY ONE WORD
from this list: Low, Medium, High, Urgent.

Do not explain anything.

Title: ${title}
Description: ${description}
`;

    // 🔹 OpenAI Call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0
    });

    const aiPriority =
      response.choices[0].message.content.trim();

    const newComplaint = await Complaint.create({
      student: studentId,
      title,
      description,
      category,
      priority: aiPriority || "Low"
    });

    res.status(201).json({
      message: "Complaint registered with AI Priority!",
      newComplaint
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({
      message: "AI Analysis Failed",
      error: error.message
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