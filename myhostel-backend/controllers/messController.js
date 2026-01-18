import MessActivity from '../models/MessActivity.js';
import OpenAI from 'openai'; // Official Library

// OpenAI Config
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Aapki .env wali key yahan use ho rahi hai
});

// 1. Mark Meal Attendance (Same as before)
export const markMeal = async (req, res) => {
    try {
        const { mealType } = req.body; 
        const today = new Date().toISOString().split('T')[0];

        let activity = await MessActivity.findOne({ student: req.user.id, date: today });
        if (!activity) {
            activity = new MessActivity({ student: req.user.id, date: today });
        }

        activity.meals[mealType] = { checked: true, time: new Date() };
        await activity.save();

        res.status(200).json({ message: `${mealType} marked!`, activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Submit Feedback with Official OpenAI SDK
export const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const today = new Date().toISOString().split('T')[0];

        let activity = await MessActivity.findOne({ student: req.user.id, date: today });
        if (!activity) return res.status(404).json({ message: "Mark attendance first!" });

        // --- AI SENTIMENT LOGIC (Using Official OpenAI SDK) ---
        let detectedSentiment = 'Neutral';
        
        if (comment) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a sentiment analyzer. Reply only with one word: Positive, Negative, or Neutral." },
                        { role: "user", content: `Analyze this hostel food review: "${comment}"` }
                    ],
                    max_tokens: 10,
                });
                detectedSentiment = response.choices[0].message.content.trim();
            } catch (err) {
                console.error("OpenAI SDK Error:", err.message);
            }
        }

        activity.feedback = { rating, comment, sentiment: detectedSentiment };
        await activity.save();

        res.status(200).json({ 
            message: "Feedback submitted!", 
            sentiment: detectedSentiment,
            activity 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Special Food Request (Sick Diet/Special Diet)
export const requestSpecialFood = async (req, res) => {
    try {
        const { item } = req.body; // e.g., "Sick Diet (Khichdi)"
        const today = new Date().toISOString().split('T')[0];

        let activity = await MessActivity.findOne({ student: req.user.id, date: today });
        if (!activity) {
            activity = new MessActivity({ student: req.user.id, date: today });
        }

        activity.specialRequest = { item, status: 'Pending' };
        await activity.save();

        res.status(200).json({ message: "Special request submitted! Warden/Chef notified. 🥣", activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};