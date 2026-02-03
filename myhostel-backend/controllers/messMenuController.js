import MessMenu from '../models/MessMenu.js';


export const updateMenu = async (req, res) => {
    try {
        const { 
            day, breakfast, breakfastTime, 
            lunch, lunchTime, snacks, snacksTime, 
            dinner, dinnerTime, specialNote 
        } = req.body;

        const expiry = new Date();
        expiry.setHours(23, 59, 59, 999); 

        const menu = await MessMenu.findOneAndUpdate(
            { day },
            { 
                breakfast, breakfastTime, 
                lunch, lunchTime, 
                snacks, snacksTime, 
                dinner, dinnerTime, 
                specialNote,
                expiresAt: expiry 
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: `${day} menu & timings updated!`, menu });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Today's Menu
export const getTodayMenu = async (req, res) => {
    try {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[new Date().getDay()];
        
        const menu = await MessMenu.findOne({ day: todayName });
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};