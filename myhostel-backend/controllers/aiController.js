import OpenAI from "openai";

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
Analyze the following hostel mess feedback and give a summary in 2 lines.
Tell me if students are happy or angry, and what is the main issue.
Feedback:
${feedbackList.join(", ")}
        `;

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
