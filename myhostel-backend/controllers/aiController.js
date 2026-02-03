import OpenAI from 'openai';
import Room from '../models/Room.js';
import User from '../models/User.js';

// OpenRouter configuration with your existing .env name
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
    baseURL: "https://openrouter.ai/api/v1", // Yeh dalna zaroori hai OpenRouter ke liye
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173", // Optional but good practice
        "X-Title": "Dnyanda Hostel"
    }
});
export const analyzeHostelComplaints = async (req, res) => {
    try {
        const { feedbackList, type } = req.body; // 'type' can be 'Mess' or 'Maintenance'

        if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
            return res.status(400).json({ error: "No complaints found to analyze" });
        }

        const feedbackTexts = feedbackList.map(f => f.comment || f.description || f);

        const prompt = `
            You are the AI Assistant for Dnyanda Hostel Warden. 
            Analyze the following ${type || 'General'} complaints:
            
            Complaints List: ${feedbackTexts.join(" | ")}

            Tasks:
            1. Categorize: Group them into Food Quality, Infrastructure, or Safety.
            2. Risk Assessment: If you detect fire, electricity sparks, severe water leakage, or medical emergencies, start with "🚨 RED ALERT:".
            3. Sentiment: Tell the Warden if the students are generally 'Frustrated', 'Satisfied', or 'Angry'.
            4. Action Plan: Give 1-2 bullet points on what the Warden should do first.

            Keep the summary professional, sharp, and helpful.`;

        const response = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1
        });

        res.status(200).json({ aiInsight: response.choices[0].message.content });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
};
export const suggestRoomAI = async (req, res) => {
    try {
        const { studentId } = req.body;

        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Department check logic
        const studentDept = student.studentDetails?.department;

        const availableRooms = await Room.find({ status: 'Available' }).populate('beds.studentId');

        if (availableRooms.length === 0) {
            return res.status(404).json({ message: "No vacant rooms available!" });
        }

        let suggestedRoom = null;
        let reason = "";

        // logic to match department
        for (let room of availableRooms) {
            const hasSameDeptStudent = room.beds.some(bed => 
                bed.studentId && bed.studentId.studentDetails?.department === studentDept
            );

            if (hasSameDeptStudent) {
                suggestedRoom = room;
                reason = `Recommended because Room ${room.roomNumber} has students from your department (${studentDept}).`;
                break; 
            }
        }

        if (!suggestedRoom) {
            suggestedRoom = availableRooms[0];
            reason = "Recommended this room as it's currently vacant and peaceful.";
        }

        res.status(200).json({
            success: true,
            recommendation: {
                roomId: suggestedRoom._id,
                roomNumber: suggestedRoom.roomNumber,
                block: suggestedRoom.block,
                floor: suggestedRoom.floor,
                reason: reason
            }
        });

    } catch (error) {
        res.status(500).json({ message: "AI Error", error: error.message });
    }
};