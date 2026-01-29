import dotenv from "dotenv";
dotenv.config();
import Complaint from '../models/Complaint.js';
import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:8080",
    "X-Title": "Hostel Complaint System"
  }
});

export default openai;

export const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const studentId = req.user.id;

const prompt = `
Analyze the hostel complaint and respond ONLY in valid JSON.

Rules:
- priority must be one of: Low, Medium, High, Urgent
- category must be one of:
  Electrical, Plumbing, Cleaning, Security, Furniture, Internet, Other
- No explanation, no extra text.

Complaint:
Title: ${title}
Description: ${description}

Response format:
{
  "priority": "Low | Medium | High | Urgent",
  "category": "Electrical | Plumbing | Cleaning | Security | Furniture | Internet | Other"
}
`;


    const response = await openai.chat.completions.create({
     model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    // 🔹 Parse AI response safely
    const aiResult = JSON.parse(
      response.choices[0].message.content.trim()
    );

    const newComplaint = await Complaint.create({
      student: studentId,
      title,
      description,
      priority: aiResult.priority || "Low",
      category: aiResult.category || "Other"
    });

    res.status(201).json({
      message: "Complaint registered with AI Category & Priority",
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

export const getMyComplaints = async (req, res) => {
  try {
    // Sirf us student ki complaints find karega jo logged in hai
    const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaff } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status || complaint.status;
    complaint.assignedStaff = assignedStaff || complaint.assignedStaff;


    if (status === 'Resolved') {
      complaint.resolvedAt = Date.now();

      const createdAt = new Date(complaint.createdAt);
      const resolvedAt = new Date(complaint.resolvedAt);


      const diffInMs = resolvedAt - createdAt;
      const diffInHours = (diffInMs / (1000 * 60 * 60)).toFixed(2);
      complaint.resolutionTime = `${diffInHours} hours`;
    }
    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully!",
      complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const assignComplaint = async (req, res) => {
  try {
    const { complaintId, staffId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        assignedTo: staffId,
        status: 'In Progress',
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('assignedTo', 'fullName staffDetails');

    res.status(200).json({
      message: "Task assigned to staff! 👷‍♂️",
      complaint
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'fullName roomNumber')
      .populate('assignedTo', 'fullName staffDetails');

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};