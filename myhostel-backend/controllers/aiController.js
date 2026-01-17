import OpenAI from 'openai';
import Room from '../models/Room.js';
import User from '../models/User.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const analyzeMessFeedback = async (req, res) => {
    try {
        const { feedbackList } = req.body;

        if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
            return res.status(400).json({ error: "Feedback list is required" });
        }


        const prompt = `
            Analyze these hostel complaints and categorize them for the Warden:
            Complaints: ${feedbackTexts.join(", ")}

            Task: 
            1. Identify if there are any immediate safety risks (like fire, sparks,Water Leakage, or medical).
            2. Summarize the overall maintenance mood.
            3. If there is an 'Urgent' issue like sparks or smoke, start the response with "🚨 RED ALERT:".`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3
        });

        const text = response.choices[0].message.content;

        res.status(200).json({ aiInsight: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




export const suggestRoomAI = async (req, res) => {
    try {
        const { studentId } = req.body;

        // 1. Student ki details lao (Especially Department)
        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const studentDept = student.studentDetails.department;

        // 2. Saare rooms lao jo khali (Available) hain
        const availableRooms = await Room.find({ status: 'Available' }).populate('beds.studentId');

        if (availableRooms.length === 0) {
            return res.status(404).json({ message: "No vacant rooms available!" });
        }

        // 3. AI/Matching Logic: Same department wala room dhoondo
        let suggestedRoom = null;
        let reason = "";

        for (let room of availableRooms) {
            const hasSameDeptStudent = room.beds.some(bed => 
                bed.studentId && bed.studentId.studentDetails.department === studentDept
            );

            if (hasSameDeptStudent) {
                suggestedRoom = room;
                reason = `Recommended because Room ${room.roomNumber} has students from your department (${studentDept}).`;
                break; 
            }
        }

        // 4. Agar koi match nahi mila, toh pehla khali room de do
        if (!suggestedRoom) {
            suggestedRoom = availableRooms[0];
            reason = "Recommended this room as it's currently vacant and peaceful.";
        }

        // Alert look for testing
        console.log(`🤖 AI Suggestion for ${student.fullName}: ${suggestedRoom.roomNumber}`);

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