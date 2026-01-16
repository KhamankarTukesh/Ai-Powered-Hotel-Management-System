import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeMessFeedback = async (req, res) => {
    try {
        const { feedbackList } = req.body; // Students ke feedbacks ka array

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Analyze the following hostel mess feedback and give a summary in 2 lines. 
        Tell me if students are happy or angry, and what is the main issue: ${feedbackList.join(", ")}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.status(200).json({ aiInsight: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};