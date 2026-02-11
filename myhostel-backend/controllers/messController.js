import MessActivity from '../models/MessActivity.js';
import OpenAI from 'openai'; // Official Library

// OpenAI Config
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Aapki .env wali key yahan use ho rahi hai
});

export const markMeal = async (req, res) => {
    try {
        const { mealType } = req.body;
        const studentId = req.user.id;
        const today = new Date().toLocaleDateString('en-CA');

        let activity = await MessActivity.findOne({ student: studentId, date: today });

        // 1. Double check
        if (activity && activity.meals && activity.meals[mealType]?.checked) {
            return res.status(400).json({ message: `Already marked ${mealType}!` });
        }

        if (!activity) {
            activity = new MessActivity({
                student: studentId,
                date: today,
                meals: { [mealType]: { checked: true, time: new Date() } }
            });
        } else {
            // Nesting check: Agar meals object hi nahi hai toh create karein
            if (!activity.meals) activity.meals = {};
            
            activity.meals[mealType] = { checked: true, time: new Date() };
            
            // VERY IMPORTANT: Mongoose ko batana padta hai ki nested field change hui hai
            activity.markModified('meals'); 
        }

        await activity.save();
        res.status(200).json({ message: "Meal marked successfully", activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Submit Feedback with Official OpenAI SDK
export const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // 1️⃣ Allow ONLY on Sunday (0 = Sunday)
        if (now.getDay() !== 0) {
            return res.status(403).json({
                message: "Feedback can be submitted only on Sundays"
            });
        }

        let activity = await MessActivity.findOne({
            student: req.user.id,
            date: today
        });

        if (!activity) {
            return res.status(404).json({
                message: "Mark attendance first!"
            });
        }

        // 2️⃣ Allow ONLY ONCE per Sunday
        if (activity.feedback && activity.feedback.comment) {
            return res.status(409).json({
                message: "You have already submitted feedback for this Sunday"
            });
        }

        let detectedSentiment = 'Neutral';

        // 3️⃣ AI Sentiment Analysis (unchanged logic)
        if (comment) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are an expert food critic analyzer. Classify the user's review strictly as 'Positive', 'Negative', or 'Neutral'. If they complain about salt, hardness, or quality, it is ALWAYS 'Negative'."
                        },
                        {
                            role: "user",
                            content: `Review: "${comment}"`
                        }
                    ],
                    temperature: 0,
                    max_tokens: 10,
                });

                detectedSentiment = response.choices[0].message.content
                    .trim()
                    .replace(/[.!?]/g, "");
            } catch (err) {
                console.error("OpenAI SDK Error:", err.message);
            }
        }

        // 4️⃣ Save feedback (once)
        activity.feedback = {
            rating,
            comment,
            sentiment: detectedSentiment,
            date: today
        };

        await activity.save();

        res.status(200).json({
            message: "Feedback submitted successfully",
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
export const getMyActivity = async (req, res) => {
    try {
        const { date } = req.query; // e.g., "2026-02-03"
        const studentId = req.user.id;

        const activity = await MessActivity.findOne({ student: studentId, date });
        
        // Agar record nahi mila, toh empty object bhejenge instead of 404
        if (!activity) {
            return res.status(200).json({ meals: {}, specialRequest: {}, feedback: {} });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getMessAnalytics = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString('en-CA');
        const totalStudents = await User.countDocuments({ role: 'student' });
        
        // Count how many people actually ate
        const activities = await MessActivity.find({ date: today });
        const breakfastCount = activities.filter(a => a.meals.breakfast?.checked).length;
        const lunchCount = activities.filter(a => a.meals.lunch?.checked).length;
        const dinnerCount = activities.filter(a => a.meals.dinner?.checked).length;

        // OpenAI Analysis for Food Wastage
        const response = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct",
            messages: [{
                role: "system",
                content: "You are a Mess Management Expert. Analyze student attendance vs meals eaten. Suggest if the chef should reduce quantity to save costs."
            }, {
                role: "user",
                content: `Total Students: ${totalStudents}. Eaten Today -> Breakfast: ${breakfastCount}, Lunch: ${lunchCount}, Dinner: ${dinnerCount}.`
            }],
            temperature: 0.3
        });

        res.status(200).json({
            counts: { breakfastCount, lunchCount, dinnerCount, totalStudents },
            aiSuggestion: response.choices[0].message.content
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Get all activities for Warden with Smart Filtering
export const getAllActivities = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString('en-CA');
        // Agar query mein date hai toh wo fetch karo, nahi toh default "today"
        const filterDate = req.query.date || today;

        const activities = await MessActivity.find({ date: filterDate })
            .populate('student', 'name roomNumber')
            .sort({ updatedAt: -1 });

        // Logic: Agar purani date ka data dekh rahe hain, 
        // toh special requests ko ignore/hide kar dena chahiye (1-day validity)
        const processedActivities = activities.map(act => {
            const data = act.toObject();
            if (data.date !== today) {
                // Purani date mein requests valid nahi hain
                data.specialRequest = { ...data.specialRequest, expired: true };
            }
            return data;
        });

        res.status(200).json(processedActivities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Special Request Status (Approve/Reject)
export const updateRequestStatus = async (req, res) => {
    try {
        const { activityId, status } = req.body;
        
        const activity = await MessActivity.findByIdAndUpdate(
            activityId,
            { "specialRequest.status": status },
            { new: true }
        );

        if (!activity) return res.status(404).json({ message: "Activity not found" });

        res.status(200).json({ message: `Request ${status} successfully`, activity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};