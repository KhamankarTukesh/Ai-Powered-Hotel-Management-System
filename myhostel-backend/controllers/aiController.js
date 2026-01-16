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
