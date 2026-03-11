import dotenv from "dotenv";
dotenv.config();
import Complaint from '../models/Complaint.js';
import OpenAI from "openai";
import { createNotification } from '../utils/notify.js';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:8080",
    "X-Title": "Hostel Complaint System"
  }
});

export default openai;

// 1. Student complaint submit karega
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
      temperature: 0.1
    });

    const aiResult = JSON.parse(response.choices[0].message.content.trim());

    const newComplaint = await Complaint.create({
      student: studentId,
      title,
      description,
      priority: aiResult.priority || "Low",
      category: aiResult.category || "Other"
    });

    // ✅ Student ko confirmation
    await createNotification(studentId,
      `📢 Your complaint "${title}" has been submitted. Priority: ${newComplaint.priority} | Category: ${newComplaint.category}.`
    );

    res.status(201).json({
      message: "Complaint registered with AI Category & Priority",
      newComplaint
    });

  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res.status(500).json({ message: "AI Analysis Failed", error: error.message });
  }
};

// 2. Warden — saari complaints
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('student', 'fullName')
      .sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};

// 3. Student — apni complaints
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error: error.message });
  }
};

// 4. Warden — status update
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedStaff } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status       = status       || complaint.status;
    complaint.assignedStaff = assignedStaff || complaint.assignedStaff;

    if (status === 'Resolved') {
      complaint.resolvedAt = Date.now();
      const diffInHours = ((complaint.resolvedAt - new Date(complaint.createdAt)) / (1000 * 60 * 60)).toFixed(2);
      complaint.resolutionTime = `${diffInHours} hours`;

      // ✅ Resolved notification
      await createNotification(complaint.student,
        `✅ Your complaint "${complaint.title}" has been resolved in ${diffInHours} hours. We hope the issue is fixed!`
      );

    } else if (status === 'In Progress') {
      // ✅ In Progress notification
      await createNotification(complaint.student,
        `🔧 Your complaint "${complaint.title}" is now being worked on. We'll update you once resolved.`
      );

    } else if (status === 'Rejected') {
      // ✅ Rejected notification
      await createNotification(complaint.student,
        `❌ Your complaint "${complaint.title}" was rejected. Please contact the warden for more details.`
      );
    }

    await complaint.save();

    res.status(200).json({ message: "Complaint updated successfully!", complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Assign complaint to staff
export const assignComplaint = async (req, res) => {
  try {
    const { complaintId, staffId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { assignedTo: staffId, status: 'In Progress', updatedAt: Date.now() },
      { new: true }
    ).populate('assignedTo', 'fullName staffDetails');

    // ✅ Student ko staff assigned notify karo
    await createNotification(complaint.student,
      `👷 Your complaint "${complaint.title}" has been assigned to a staff member and is now In Progress.`
    );

    res.status(200).json({ message: "Task assigned to staff! 👷‍♂️", complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get complaint by ID
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

// 7. Delete resolved complaint
export const deleteResolvedComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: "Only resolved complaints can be deleted." });
    }

    await Complaint.findByIdAndDelete(id);

    res.status(200).json({ message: "Complaint record deleted successfully." });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};